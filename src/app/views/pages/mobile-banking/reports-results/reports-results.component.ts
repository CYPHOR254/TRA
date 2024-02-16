import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  NgbModalRef,
  NgbModal,
  NgbActiveModal,
} from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'src/app/shared/services/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reports-results',
  templateUrl: './reports-results.component.html',
  styleUrls: ['./reports-results.component.scss'],
})
export class ReportsResultsComponent implements OnInit {
  isAppealButtonVisible = true;
  isViewTrackButtonVisible = false;

  public modalRef: NgbModalRef;
  // URL of the brochure file you want to download
  // Store the sanitized URL
  public downloadLink: SafeUrl;
  previewImageUrl: string = '';

  isAppealMade: boolean = false;
  isAppealSubmitted: boolean = false;
  appealDate: Date;

  errorMsg: string;
  hasError: boolean = false;
  isLoading: boolean = false;
  errorMessage: string;
  // bread crumb items

  loading = true;
  reorderable = true;
  showAppealForm: boolean = false;
  showAppeals: boolean = false;

  public formR: FormGroup;
  results: any[] = [];
  appealId: any;
  appealData: any;
  resultRef: string | null = null;

  constructor(
    private httpService: HttpService,
    private modalService: NgbModal,
    public fb: FormBuilder,
    private http: HttpClient,
    public router: Router,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    public activeModal: NgbActiveModal
  ) {
    // this.downloadLink = this.sanitizer.bypassSecurityTrustUrl(this.brochureUrl);
    this.downloadLink = '';

    this.formR = fb.group({
      reason: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadData();
    this.loadAppealsData();

    this.appealDate = new Date();
    // this.isAppealButtonVisible = this.calculateAppealButtonVisibility();
  }

  get fs(): { [p: string]: AbstractControl } {
    return this.formR.controls;
  }

  openModal(modalContent: any) {
    this.modalRef = this.modalService.open(modalContent, {
      centered: true,
      size: 'md',
    });
  }

  calculateAppealButtonVisibility(result: any): boolean {
    const timeLimitInDays = 14;
    const currentTime = new Date();
    const daysElapsed = Math.floor(
      (currentTime.getTime() - new Date(result.created_on).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (
      result.hasAppeal ||
      result.appealStatus === 'PENDING' ||
      result.appealStatus === 'APPROVED' ||
      result.appealStatus === 'REJECTED'
    ) {
      result.isButtonDeactivated = true; // Deactivate the button if there is an appeal or if the appeal status is 'PENDING'
    } else {
      result.isButtonDeactivated = daysElapsed > timeLimitInDays; // Deactivate the button only if no appeal for this result within the time limit
    }

    return true; // Always return true to make the button visible
  }

  toggleAppealForm(result: any) {
    if (this.showAppealForm) {
      this.showAppealForm = false;
    } else {
      this.showAppealForm = true;
      this.appealId = result;
    }
  }

  private loadAppealsData(): void {
    let licence_number = localStorage.getItem('licenceNumber')!;

    let model = {
      licence_number,
    };
    this.httpService.postReq(`/api/v1/portal/getAppeals`, model).subscribe({
      next: (res: any) => {
        if (res.status === '00') {
          this.appealData = res.data;
          console.log(this.appealData);

          this.loadData();
        } else {
          console.log('Failed', 'Unable to fetch appeals data', 'error');
        }
      },
      error: (error: any) => {
        console.log('Error', error.message, 'error');
      },
    });
  }
  private loadData(): any {
    this.loading = true;
    let licenceNumber = localStorage.getItem('licenceNumber')!;
    let model = {
      licenceNumber,
      page: 0,
      size: 100,
    };

    this.httpService
      .postReq(
        `/api/v1/admin/customer/portal/fetch-result-by-licence-number`,
        model
      )
      .subscribe({
        next: (res: any) => {
          if (res.status == 200) {
            const result = res.data.filter(
              (request: any) =>
                request.status === 'PUBLISHED' ||
                request.status === 'APPEALED' ||
                request.status === 'RELEASED'
            );

            // Collect result_ref values into an array
            // const resultRefs = result.map((request: any) => request.resultRef);

            // this.resultRef = resultRefs.join(', '); // Join the array into a string with commas
            // const appealData = this.appealData || [];

            // result.forEach((request: any) => {
            //   const appealStatus = appealData.find(
            //     (appeal: any) => appeal.result_ref === request.result_ref
            //   )?.status;
            //   request.appealStatus = appealStatus || null;
            //   request.rating = Number(request.rating);
            //   // console.log('Appeal Status',appealStatus)
            //   // console.log('Results Ref', request.result_ref)
            // });

            this.results = result;
            this.loading = false;

            // Split the resultRef string into an array
            // const resultRefArray = this.resultRef?.split(', ');
            // resultRefArray?.forEach((resultRef: string) => {
            //   console.log(resultRef);
            // });
          } else {
            console.log('Failed', 'Unable to fetch results', 'error');
          }
        },
        error: (error: any) => {
          console.log('Error', error.message, 'error');
        },
      });
  }

  formatDate(date: string): string {
    const formattedDate = this.datePipe.transform(date, 'dd MMM yyyy');
    return formattedDate ? formattedDate.toUpperCase() : '';
  }

  getSanitizedStatusImage(status: string): any {
    switch (status) {
      case 'PUBLISHED':
        return this.sanitizer.bypassSecurityTrustResourceUrl(
          'assets/images/approve.png'
        );
      case 'PENDING':
        return this.sanitizer.bypassSecurityTrustResourceUrl(
          'assets/images/time.png'
        );
      // Add more cases for other status if needed
      default:
        return this.sanitizer.bypassSecurityTrustResourceUrl(
          'assets/images/star.jpg'
        );
    }
  }

  handleDownload(result: any) {
    if (result && result.download_url) {
      const downloadUrl = result.download_url;
      const absoluteDownloadUrl = downloadUrl.startsWith('http')
        ? downloadUrl
        : `http://${downloadUrl}`;

      // Trigger the file download using HttpClient
      this.http.get(absoluteDownloadUrl, { responseType: 'blob' }).subscribe(
        (blob: Blob) => {
          // Create a new anchor element
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);

          // Set the 'download' attribute to force the download instead of navigation
          link.setAttribute('download', 'downloaded_file');

          // Append the link to the DOM and trigger a click event to initiate the download
          document.body.appendChild(link);
          link.click();

          // Remove the link from the DOM after the download is complete
          document.body.removeChild(link);
        },
        (error) => {
          console.error('Error downloading the file:', error);
        }
      );
    } else {
      console.error('Download URL is not available in the result object.');
    }
  }

  downloadCertificate(fileUrl: string) {
    let linkUrl = fileUrl.replace(
      '10.20.2.19:7600',
      'https://test-api.ekenya.co.ke/tra-backend'
    );
    linkUrl = linkUrl.includes('https') ? linkUrl : 'https://'.concat(linkUrl);
    window.open(linkUrl, '_blank');
    // const normalizedFileUrl = fileUrl.replace("10.20.2.19:7600", "https://test-api.ekenya.co.ke/tra-backend");
    // // console.log(normalizedFileUrl);
    // const link = document.createElement('a');
    // link.href = normalizedFileUrl;
    // link.target = '_blank';
    // link.click();
  }

  getAppealButtonText(status: string, appealStatus: string | null): string {
    if (appealStatus === 'PENDING') {
      return 'Appealled'; // If appealStatus is 'PENDING', show 'Appealed'
    } else if (appealStatus === 'APPROVED') {
      return 'Accepted';
    } else if (appealStatus === 'REJECTED') {
      return 'Failed';
    } else if (status === 'PUBLISHED' || status === 'RELEASED') {
      return 'Appeal';
    } else if (status === 'APPEALED') {
      return 'Already Appealed';
    } else {
      return 'Unknown Status';
    }
  }

  hideAppealForm() {
    this.showAppealForm = false;
    this.formR.reset();
  }

  hideAppeals() {
    this.showAppeals = false;
  }

  viewAppeal() {
    if (this.showAppeals) {
      this.hideAppeals();
    } else {
      this.showAppeals = true;
      // this.appealId = id;
    }
  }

  raiseAppeal(id: number): void {
    if (this.formR.invalid) {
      return;
    }
    const licenceNumber = localStorage.getItem('licenceNumber')!;
    // const resultRef = this.results.find(
    //   (result: any) => result.id === id
    // )?.result_ref;
    // if (!resultRef) {
    //   console.log('Unable to find result_ref for the specified id');
    //   return;
    // }
    const model = {
      licenceNumber,
      resultRef: this.appealId['resultRef'],
      reason: this.formR.value.reason,
    };
    this.isLoading = true;
    // console.log(model)
    this.httpService
      .postReq(`/api/v1/admin/customer/portal/create-appeal`, model)
      .subscribe({
        next: (result: any) => {
          if (result.status === 200) {
            this.isLoading = false;

            Swal.fire('Appeal Raised Successfully', 'success').then((r) =>
              console.log(r)
            );
            this.loadData();
            this.loadAppealsData();
            this.hideAppealForm();

            // this.appealDate = new Date();
            // this.isAppealButtonVisible = false;
            // this.isViewTrackButtonVisible = true;
          } else {
            this.activeModal.close('error');
            Swal.fire('Raised Apeal Failed, Try Again', 'error').then((r) =>
              console.log(r)
            );
            this.hideAppealForm();
            this.isLoading = true;
          }
        },
        error: (error: any) => {
          Swal.fire('Raised Appeal error', 'error');
          this.hideAppealForm();
          this.isLoading = true;
        },
      });
  }

  isButtonDisabled(status: string, task_type: string): boolean {
    if (task_type === 'CLASSIFICATION') {
      return false;
    } else {
      return status === 'Passed' || status === 'Appealed';
    }
  }
}
