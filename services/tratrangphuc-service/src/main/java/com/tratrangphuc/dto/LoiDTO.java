package com.tratrangphuc.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoiDTO {
    private int id;
    private String tenLoi;
    private float mucPhat;
    private String moTa;
}
