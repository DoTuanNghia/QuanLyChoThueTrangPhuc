package com.loihongphat.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoiDTO {
    private int id;

    @NotBlank(message = "Tên lỗi không được để trống")
    private String tenLoi;

    @Min(value = 0, message = "Mức phạt phải >= 0")
    private float mucPhat;

    private String moTa;
}
