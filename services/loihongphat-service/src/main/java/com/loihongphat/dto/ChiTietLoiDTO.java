package com.loihongphat.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietLoiDTO {
    private int id;
    private int tongLoi;
    private float tienPhat;
    private int loiId;
    private String tenLoi;
    private float mucPhat;
    private Integer chiTietTraId;
}
