package com.quanlichothuetrangphuc.tratrangphuc.repository;

import com.quanlichothuetrangphuc.tratrangphuc.model.TrangPhuc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrangPhucRepository extends JpaRepository<TrangPhuc, Integer> {
    List<TrangPhuc> findByTenContainingIgnoreCase(String ten);
}
