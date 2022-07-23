import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRegisterService } from 'src/app/login-register/services/login-register.service';
import { Product } from '../model/product.service';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent implements OnInit {
  error!: boolean;
  alertType!: string;
  message!: string;
  products: Product[] = []
  activeUser: boolean = false;
  name: boolean = true;
  code: boolean = false;
  brand: boolean = false;
  value!: string;
  private _priceVal: number = 80000;

  constructor(private productService: ProductService, private route: Router, private loginRegisterService: LoginRegisterService) {
  }

  ngOnInit(): void {
    this.activeUser = (localStorage.getItem("currentUser")) ? true : false;
  }

  set search(value: string) {
    this.value = value;
    setTimeout(() => {
      let params = {
        name: (this.name) ? value : null,
        code: (this.code) ? value : null,
        brand: (this.brand) ? value : null
      }
      console.log(params);
      this.productService.searchProduct(params).subscribe((products) => {
        setTimeout(() => {

        if (products.length === 0 && value) {
            this.error = true;
            this.alertType = "danger";
            this.message = "No products found";
            this.products = [];
            setTimeout(() => {
              this.error = false;
            }, 1500);
        } else {
          if (value == "") {
            this.products = []
          } else {
            if (this.activeUser) {
              this.products = products.filter(prod => +prod.price <= +this.priceVal);
            }
            else {
              this.products = products;
            }
          }
        }
      }, 500);
      });
    }, 900);
  }

  signIn(): void {
    this.route.navigate(['login']);
  }

  signUp(): void {
    this.route.navigate(['register']);
  }

  logout(): void {
    window.location.reload();
    this.loginRegisterService.logoutUser();
  }

  viewDetails(code: String): void {
    this.route.navigate([`product-detail/${code}`]);
  }

  public get priceVal(): number {
    return this._priceVal;
  }
  public set priceVal(value: number) {
    this.search = this.value;
    this._priceVal = value;
  }

  toggleName() {
    this.name = !this.name;
    this.search = this.value;
  }

  toggleCode() {
    this.code = !this.code;
    this.search = this.value;
  }

  toggleBrand() {
    this.brand = !this.brand;
    this.search = this.value;
  }
}
