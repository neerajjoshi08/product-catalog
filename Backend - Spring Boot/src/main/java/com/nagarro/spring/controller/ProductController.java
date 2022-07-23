package com.example.spring.controller;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.spring.model.Product;
import com.example.spring.repository.ProductRepository;

@RequestMapping("prod")
@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class ProductController {
	@Autowired
	ProductRepository productRepository;

	// Searching the products according to name, product, and brand, and returning
	// the result set.
	@GetMapping("products/search")
	public ResponseEntity<?> getProductList(@RequestParam Map<String, String> filters) {
		Map<String, String> res = new HashMap<>();
		try {
			List<Product> products = productRepository.findAll();

			List<Product> filteredProducts = new ArrayList<>();
			Set<String> productCodesSet = new HashSet<>();
			for (Entry<String, String> filter : filters.entrySet()) {
				switch (filter.getKey().toLowerCase()) {
				case "name": {
					List<Product> productListByNames = products.stream()
							.filter(product -> product.getName().toLowerCase().contains(filter.getValue().toLowerCase())
									&& !productCodesSet.contains(product.getCode()))
							.collect(Collectors.toList());
					for (Product product : productListByNames) {
						productCodesSet.add(product.getCode());
					}
					filteredProducts.addAll(productListByNames);
					break;
				}
				case "code": {
					List<Product> productListByCode = products.stream()
							.filter(product -> product.getCode().toLowerCase().equals(filter.getValue().toLowerCase())
									&& !productCodesSet.contains(product.getCode()))
							.collect(Collectors.toList());
					for (Product product : productListByCode) {
						productCodesSet.add(product.getCode());
					}
					filteredProducts.addAll(productListByCode);
					break;
				}
				case "brand": {
					List<Product> productListByBrand = products.stream()
							.filter((product) -> product.getBrand().toLowerCase().contains(
									filter.getValue().toLowerCase()) && !productCodesSet.contains(product.getCode()))
							.collect(Collectors.toList());
					for (Product product : productListByBrand) {
						productCodesSet.add(product.getCode());
					}
					filteredProducts.addAll(productListByBrand);
					break;
				}
				}
			}
			return new ResponseEntity<>(filteredProducts, HttpStatus.OK);
		} catch (Exception e) {
			res.put("code", HttpStatus.BAD_GATEWAY.toString());
			res.put("message", "There is some issue, try after some time");
			return new ResponseEntity<>(res, HttpStatus.BAD_GATEWAY);
		}
	}

	// Getting a particular product detail
	@GetMapping("products/{code}")
	public ResponseEntity<?> getProductDetailByCode(@PathVariable("code") String code) {
		Map<String, String> res = new HashMap<>();
		try {
			Product product = productRepository.findByCode(code);
			if (product != null) {
				return new ResponseEntity<>(product, HttpStatus.OK);
			} else {
				res.put("code", HttpStatus.NOT_FOUND.toString());
				res.put("message", "Product not found");
				return new ResponseEntity<>(res, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			res.put("code", HttpStatus.BAD_GATEWAY.toString());
			res.put("message", "There is some issue, try after some time");
			return new ResponseEntity<>(res, HttpStatus.BAD_GATEWAY);
		}
	}

	// Getting the price of all the products
	@GetMapping("products/price")
	public ResponseEntity<?> getAllProductPrice() {
		Map<String, String> res = new HashMap<>();
		try {
			List<Product> products = productRepository.findAll();
			List<Double> listOfPrices = products.stream().map(product -> product.getPrice())
					.collect(Collectors.toList());
			return new ResponseEntity<>(listOfPrices, HttpStatus.OK);
		} catch (Exception e) {
			res.put("code", HttpStatus.BAD_GATEWAY.toString());
			res.put("message", "There is some issue, try after some time");
			return new ResponseEntity<>(res, HttpStatus.BAD_GATEWAY);
		}
	}

	// Getting the price of a particular product
	@GetMapping("products/price/{code}")
	public ResponseEntity<?> getProductPrice(@PathVariable String code) {
		Map<String, String> res = new HashMap<>();
		try {
			Product product = productRepository.findByCode(code);
			if (product != null) {
				return new ResponseEntity<>(product.getPrice(), HttpStatus.OK);
			} else {
				res.put("code", HttpStatus.NOT_FOUND.toString());
				res.put("message", "Product not found");
				return new ResponseEntity<>(res, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			res.put("code", HttpStatus.BAD_GATEWAY.toString());
			res.put("message", "There is some issue, try after some time");
			return new ResponseEntity<>(res, HttpStatus.BAD_GATEWAY);
		}
	}

	// Getting the pin codes availability for a particular product
	@GetMapping("products/service/{code}")
	public ResponseEntity<?> getProductService(@PathVariable("code") String code) {
		Map<String, String> res = new HashMap<>();
		try {
			Product product = productRepository.findByCode(code);
			if (product != null) {
				return new ResponseEntity<>(product.getAvailability(), HttpStatus.OK);
			} else {
				res.put("code", HttpStatus.NOT_FOUND.toString());
				res.put("message", "Product not found");
				return new ResponseEntity<>(res, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			res.put("code", HttpStatus.BAD_GATEWAY.toString());
			res.put("message", "There is some issue, try after some time");
			return new ResponseEntity<>(res, HttpStatus.BAD_GATEWAY);
		}
	}

	// Adding products in a database (for administration purpose only)
	@PostMapping("add-product/{path}")
	public ResponseEntity<?> addProduct(@RequestBody Product product, @PathVariable("path") String path) {
		File file = new File(
				"D:\\Workspace\\eclipse-workspace\\SpringBootAPI\\src\\main\\resources\\images\\" + path + ".jpg");
		byte[] bFile = new byte[(int) file.length()];

		try {
			FileInputStream fileInputStream = new FileInputStream(file);
			fileInputStream.read(bFile);
			fileInputStream.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		product.setImage(bFile);
		productRepository.save(product);
		return null;
	}
}
