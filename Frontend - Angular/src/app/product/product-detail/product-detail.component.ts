import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginRegisterService } from 'src/app/login-register/services/login-register.service';
import { Product } from '../model/product.service';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product!: Product
  productCode: string = "";
  activeUser: boolean = false;
  code!: string;
  private _inputCode!: string;
  available: boolean = false;
  submitPressed: boolean = false;

  constructor(private route: Router, private loginRegisterService: LoginRegisterService, private productService: ProductService, private activatedRoute: ActivatedRoute) { }

  public get inputCode(): string {
    return this._inputCode;
  }
  public set inputCode(value: string) {
    this.submitPressed = false;
    this._inputCode = value;
  }

  ngOnInit(): void {
    this.activeUser = (localStorage.getItem('currentUser')) ? true : false;
    this.activatedRoute.params.subscribe((params) => {
      this.code = params.code
    });

    this.productService.getProduct(this.code).subscribe((product) => {
      this.product = product;

    })
  }

  onSubmit() {
    if (this.inputCodeValid()) {
      this.productService.getProductService(this.code).subscribe((service: number[]) => {
        if (service.indexOf(+this.inputCode) > -1) {
          this.available = true;
        } else {
          this.available = false;
        }
        this.submitPressed = true;
      })
    }
  }

  inputCodeValid() {
    return this.inputCode.length === 6;
  }

  logout() {
    this.loginRegisterService.logoutUser();
  }

}
