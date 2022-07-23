package com.example.spring.controller;

import java.util.HashMap;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.spring.model.User;
import com.example.spring.repository.UserRepository;

@RequestMapping("auth")
@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class RegisterUserController {
	@Autowired
	private UserRepository userRepository;

	// Registering the new user
	@PostMapping("/register")
	public ResponseEntity<?> register(@Valid @RequestBody User user) {
		Map<String, String> res = new HashMap<>();
		try {
			User searchedUser = userRepository.findByEmail(user.getEmail());

			// Checking if user with same email exists or not
			if (searchedUser != null) {
				res.put("code", HttpStatus.CONFLICT.toString());
				res.put("message", "User already exists with same email.");
				return new ResponseEntity<>(res, HttpStatus.CONFLICT);
			}
			userRepository.save(user);
			res.put("code", HttpStatus.OK.toString());
			res.put("message", "User successfully registered.");
			return new ResponseEntity<>(res, HttpStatus.OK);

		} catch (Exception e) {
			res.put("code", HttpStatus.BAD_GATEWAY.toString());
			res.put("message", "There is some issue, try after some time");
			return new ResponseEntity<>(res, HttpStatus.BAD_GATEWAY);
		}
	}
}
