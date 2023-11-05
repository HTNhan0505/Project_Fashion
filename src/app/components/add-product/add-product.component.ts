import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from 'src/app/service/core.service';
import { ProductService } from 'src/app/service/product.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent {
  empForm: FormGroup;
  isErrorFormat = false;
  isGender: any;
  category: any = [
    {
      id: '1',
      name: 'Áo thun',
      detail: ''
    },
    {
      id: '2',
      name: 'Áo khoác',
      detail: ''
    },
    {
      id: '3',
      name: 'Quần ngắn',
      detail: ''
    },
    {
      id: '4',
      name: 'Quần dài',
      detail: ''
    }
  ]
  file: any
  listFile: string[] = []
  image_list: any = [
  ];

  constructor(
    private _fb: FormBuilder,
    private _proService: ProductService,
    private _dialogRef: MatDialogRef<AddProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService,
    public snackBar: MatSnackBar,
    public http: HttpClient,
  ) {
    this.empForm = this._fb.group({
      productName: '',
      detail: '',
      price: '',
      quantity: '',
      isMen: '',
      categoryID: '',
      listImage: []
    });
  }

  ngOnInit(): void {
    this.isErrorFormat = false;

    this.empForm.patchValue(this.data);
  }
  // Thêm dấu phẩy vào giá tiền
  setPrice(value: any) {
    if (typeof value !== 'number') {
      let formattedNumber = value.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      this.empForm.value['price'] = formattedNumber
    }
  }
  convertImg(file: any) {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      this.file = reader.result
      this.listFile.push(this.file)
      this.empForm.value['listImage'] = this.listFile
    };

  }
  onchange(event: any) {

    for (let i = 0; i < (event.target.files.length); i++) {
      this.convertImg(event.target.files[i])

      let obj = { 'src': "" }
      obj.src = URL.createObjectURL(event.target.files[i])
      this.image_list.push(obj)
    }

  }
  // Xóa ảnh
  deleteImage(img: any) {
    this.image_list.splice(img, 1)
    this.empForm.value['listImage'].splice(img, 1)
  }
  // Check format form để trả về true false
  checkFormatAdmin() {
    if (
      this.empForm.value['productName'] === '' ||
      this.empForm.value['detail'] === '' ||
      this.empForm.value['price'] === '' ||
      this.empForm.value['quantity'] === '' ||
      this.empForm.value['isMen'] === '' ||
      this.empForm.value['categoryID'] === '' ||
      this.listFile.length === 0
    ) {
      this.isErrorFormat = true;
    } else {
      this.isErrorFormat = false;
    }
  }
  // Hàm xử lý khi submit
  onFormSubmit() {
    this.checkFormatAdmin();
    if (this.isErrorFormat == true) {
      this._coreService.openSnackBar('Fields can not empty');
    } else {
      this.empForm.value['price'] = +this.empForm.value['price']
      if (this.empForm.controls['isMen']['value'] == '-1') {
        delete this.empForm.value['isMen']
      }
      this._proService.addProduct(this.empForm.value).subscribe({
        next: (val: any) => {
          this._coreService.openSnackBar('Product added successfully');
          this._dialogRef.close(true);
        },

        error: (err: any) => {
          this._coreService.openSnackBar('Add product error');

          console.error(err);
        },
      });

    }
    console.log(this.empForm.value)

  }
}
