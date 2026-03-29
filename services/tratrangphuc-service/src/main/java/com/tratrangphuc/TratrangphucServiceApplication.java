package com.tratrangphuc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class TratrangphucServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(TratrangphucServiceApplication.class, args);
    }
}
