package com.ksu.project.projectmanagement.repository;

import com.ksu.project.projectmanagement.model.Risk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RiskRepository extends JpaRepository<Risk, Long> {
}
