package com.ksu.project.projectmanagement.repository;

import com.ksu.project.projectmanagement.model.Requirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.*;


@Repository
public interface RequirementRepository extends JpaRepository<Requirement, Long> {

    List<Requirement> findByProjectId(Long projectId);

}
