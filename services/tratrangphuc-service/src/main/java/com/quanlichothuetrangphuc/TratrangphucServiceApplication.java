package com.quanlichothuetrangphuc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class TratrangphucServiceApplication extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(TratrangphucServiceApplication.class);
	}

	public static void main(String[] args) {
		SpringApplication.run(TratrangphucServiceApplication.class, args);
	}
}
