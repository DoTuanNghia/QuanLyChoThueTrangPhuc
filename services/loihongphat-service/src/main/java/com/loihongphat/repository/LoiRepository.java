package com.loihongphat.repository;

import com.loihongphat.model.Loi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoiRepository extends JpaRepository<Loi, Integer> {
}
