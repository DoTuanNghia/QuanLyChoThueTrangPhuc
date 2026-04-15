package com.quanlichothuetrangphuc.tratrangphuc.repository;

import com.quanlichothuetrangphuc.tratrangphuc.model.ChiTietTra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChiTietTraRepository extends JpaRepository<ChiTietTra, Integer> {
}
