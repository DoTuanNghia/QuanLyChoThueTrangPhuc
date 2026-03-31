package com.quanlichothuetrangphuc.tratrangphuc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class TraTrangPhucServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(TraTrangPhucServiceApplication.class, args);
    }
}

