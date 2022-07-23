package com.example.spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.spring.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
	Product findByCode(String code);
}
