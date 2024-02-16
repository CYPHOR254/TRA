import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import {
  NgbDateStruct,
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'src/app/shared/services/http.service';
import Swal from 'sweetalert2';
import { SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  preserveWhitespaces: true,
})
export class DashboardComponent implements OnInit {
  public form: FormGroup;
  // errorMsg: string;
  // hasError: boolean = false;
  // certificateAvailable = false;
  // private brochureUrl = 'assets/images/certificate.png';
  uploadedImageUrl: string | undefined;
  // imageUploaded = false;
  selectedFile: File | null = null;
  selectedImage: any = 'assets/images/ns.jpg';
  // uploadedImage: File | null = null;
  // Store the sanitized URL
  public downloadLink: SafeUrl;
  isLoading: boolean = false;
  // errorMessage: string;
  modalRef: NgbModalRef;
  facilityData: any;
  companyEmail: string | null;
  licenceNumber: string | null;
  profile: string | null;
  companyRegistrationDate: string | null;
  county: string | null;
  contactPerson: string | null;
  logo: string | null;
  facilityType: string | null;
  facilityCategory: string | null;
  businessPhone: string | null;
  selectedImageFile: File | null = null;

  showLeaveCommentForm: boolean = false;
  showFormImage = 'assets/images/chats.png';

  existingImage: SafeResourceUrl;
  perPage = 100;
  page = 1;
  /**
   * NgbDatepicker
   */
  currentDate: NgbDateStruct;
  standards: any;
  loading: boolean;
  profileDetails: any;
  showUploadText = false;
  certificate: any;
  resultRef: any = '';
  results: any = [];
  message: string;
  constructor(
    private httpService: HttpService,
    public modal: NgbModal,
    public router: Router,
    public activeModal: NgbActiveModal
  ) {
    // this.downloadLink = this.sanitizer.bypassSecurityTrustUrl(this.brochureUrl);
  }

  ngOnInit(): void {
    this.loadData();
    // this.loadCertificate();
  }

  private loadData(): any {
    this.loading = true;
    // let userId = JSON.parse(localStorage.getItem('data')!)['user']['id'];
    let model = {
      email: localStorage.getItem('email')!,
    };
    // console.log(model)
    this.httpService
      .postReq(`/api/v1/admin/customer/get-customer`, model)
      .subscribe({
        next: (res: any) => {
          console.log(res);

          if (res.status == 200) {
            // this.profileDetails = res['data'];
            this.facilityData = res['data'];
            localStorage.setItem(
              'licenceNumber',
              this.facilityData['licenceNumber']
            );
            localStorage.setItem('taxPin', this.facilityData['taxPin']);
            this.loadResults();

            // if (
            //   this.profileDetails.PhotoPath &&
            //   !this.profileDetails.PhotoPath.startsWith('http://') &&
            //   !this.profileDetails.PhotoPath.startsWith('https://')
            // ) {
            //   this.uploadedImageUrl =
            //     'https://' + this.profileDetails.PhotoPath;
            // } else {
            //   this.uploadedImageUrl =
            //     this.profileDetails.PhotoPath || 'assets/images/sd.png'; // Use the default image if PhotoPath is empty
            // }
            // console.log(this.uploadedImageUrl)
            this.loading = false;
          } else {
            // console.log('Failed', 'Unable to fetch profile', 'error');
          }
        },
        error: (error: any) => {
          // console.log('Error', error.message, 'error');
        },
      });
    // this.httpService
    //   .customerPortalPost(`api/v1/auth/getProfile`, model)
    //   .subscribe(
    //     (res: any) => {
    //       if (res.status == '00') {
    //         this.profileDetails = res['data'];
    //         if (
    //           this.profileDetails.PhotoPath &&
    //           !this.profileDetails.PhotoPath.startsWith('http://') &&
    //           !this.profileDetails.PhotoPath.startsWith('https://')
    //         ) {
    //           this.uploadedImageUrl =
    //             'https://' + this.profileDetails.PhotoPath;
    //         } else {
    //           this.uploadedImageUrl =
    //             this.profileDetails.PhotoPath || 'assets/images/sd.png'; // Use the default image if PhotoPath is empty
    //         }
    //         // console.log(this.uploadedImageUrl)
    //         this.loading = false;
    //       } else {
    //         console.log('Failed', 'Unable to fetch profile', 'error');
    //       }
    //     },
    //     (error: any) => {
    //       console.log('Error', error.message, 'error');
    //     }
    //   );
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
        // Here you can implement logic to upload the image to your server if needed
      };
      reader.readAsDataURL(file);
    }
  }

  showCertificateMessage: boolean = false;

  onDownloadClick() {
    this.showCertificateMessage = true;
    setTimeout(() => {
      this.hideCertificateMessage();
    }, 3000);
  }

  hideCertificateMessage() {
    this.showCertificateMessage = false;
  }

  handleImageUpload(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.uploadedImageUrl = e.target?.result as string;
        // this.imageUploaded = true;
        this.showUploadText = true;

        const formData = new FormData();
        // console.log(formData)
        formData.append('file', file);

        formData.append('customer', this.facilityData['licenceNumber']);
        this.httpService
          .postReq(
            `/api/v1/admin/customer/portal/upload-customer-image`,
            formData
          )
          .subscribe({
            next: (result: any) => {
              if (result.status === 200) {
                // console.log('Image uploaded successfully!', result);
                this.isLoading = false;
                this.activeModal.close('success');
                Swal.fire('Image uploaded Successfully!', 'success').then((r) =>
                  console.log(r)
                );
                this.form.reset();
              } else {
                Swal.fire('Image Uploaded Failed, Try Again', 'error').then(
                  (r) => console.log(r)
                );
              }
            },
            error: () => {
              Swal.fire('Image Uploaded error', 'error');
            },
          });
      };
      reader.readAsDataURL(file);
    }
  }

  private loadResults(): any {
    this.loading = true;
    let licenceNumber = this.facilityData['licenceNumber'];
    let model = {
      licenceNumber,
      page: this.page - 1,
      size: this.perPage,
    };
    //
    this.httpService
      .postReq(
        `/api/v1/admin/customer/portal/fetch-result-by-licence-number`,
        model
      )
      .subscribe({
        next: (res: any) => {
          if (res.status == 200) {
            this.results = res['data'];
            console.log(this.results);

            if (this.results !== undefined) {
              const result = res.data.filter(
                (request: any) =>
                  request.status === 'PUBLISHED' ||
                  request.status === 'APPEALED' ||
                  request.status === 'RELEASED'
              );
              this.resultRef = res.data[0].resultRef;
              // console.log(this.resultRef)

              this.results = result;
            } else {
              this.results = [];
            }

            this.loading = false;
          } else {
            console.log('Failed', 'Unable to fetch results', 'error');
          }
        },
        error: (error: any) => {
          console.log('Error', error.message, 'error');
        },
      });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return formatDate(date, 'd MMMM yyyy', 'en-US', '+0530');
  }

  // loadCertificate(): void {
  //   this.loading = true;
  //   let model = {
  //     resultRef: 'RSTDAXOYO',
  //   };
  //   this.httpService
  //     .customerPortalPosts('admin/customer/portal/get-certificate', model)
  //     .subscribe((res: any) => {
  //       console.log(res);

  //       if (res.status === 200) {
  //         this.certificate = res.data.downloadUrl;
  //         if (this.certificate) {
  //           this.existingImage = this.certificate.replace(
  //             'http://10.20.2.19:7600',
  //             'https://test-api.ekenya.co.ke/tra-backend'
  //           );
  //         } else {
  //           this.existingImage = 'assets/images/certificate.png';
  //         }
  //       } else {
  //         this.loading = false;
  //       }
  //     });
  //   this.loading = false;
  // }

  getCertificate(res: any): void {
    this.loading = true;
    let model = {
      resultRef: res.resultRef,
    };
    this.httpService
      .postReqBlob('/api/v1/admin/customer/portal/generate-certificate', model)
      .subscribe(
        (response: Blob) => {
          const downloadLink = document.createElement('a');
          const imageUrl = URL.createObjectURL(response);

          downloadLink.href = imageUrl;
          downloadLink.download = 'Certificate.pdf';
          downloadLink.target = '_blank';

          downloadLink.click();

          // Clean up
          URL.revokeObjectURL(imageUrl);

          this.loading = false;
        },
        (error: any) => {
          console.error('Error fetching certificate:', error);
          this.loading = false;
        }
      );
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  handleImageError() {
    this.uploadedImageUrl = 'assets/images/sd.png';
  }
}
