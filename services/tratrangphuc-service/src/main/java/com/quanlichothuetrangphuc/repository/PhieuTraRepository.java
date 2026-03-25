package com.quanlichothuetrangphuc.repository;

import com.quanlichothuetrangphuc.model.PhieuTra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhieuTraRepository extends JpaRepository<PhieuTra, Integer> {
}
