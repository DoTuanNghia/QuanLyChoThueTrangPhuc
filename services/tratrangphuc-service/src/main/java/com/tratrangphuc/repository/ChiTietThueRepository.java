package com.tratrangphuc.repository;

import com.tratrangphuc.model.ChiTietThue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChiTietThueRepository extends JpaRepository<ChiTietThue, Integer> {
}
