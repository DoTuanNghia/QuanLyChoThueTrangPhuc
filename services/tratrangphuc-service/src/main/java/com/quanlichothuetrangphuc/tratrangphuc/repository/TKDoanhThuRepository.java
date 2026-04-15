package com.quanlichothuetrangphuc.tratrangphuc.repository;

import com.quanlichothuetrangphuc.tratrangphuc.model.TKDoanhThu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TKDoanhThuRepository extends JpaRepository<TKDoanhThu, Integer> {
}
