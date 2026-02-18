package com.spring.boot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class StorelyApplication {


	static {
		// Set these BEFORE Spring Boot starts
		System.setProperty("https.protocols", "TLSv1.2,TLSv1.3");
		System.setProperty("jdk.tls.client.protocols", "TLSv1.2,TLSv1.3");
		System.setProperty("jdk.tls.client.enableSessionTicketExtension", "true");
		System.setProperty("jdk.tls.useExtendedMasterSecret", "true");
	}


	public static void main(String[] args) {
		SpringApplication.run(StorelyApplication.class, args);
	}

}
