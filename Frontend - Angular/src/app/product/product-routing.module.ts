import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductGuard } from '../service/product.guard';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductSearchComponent } from './product-search/product-search.component';

const routes: Routes = [
  { path: 'product-search', component: ProductSearchComponent },
  { path: 'product-detail/:code', component: ProductDetailComponent, canActivate: [ProductGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
