package com.ksu.project.projectmanagement.repository;

import com.ksu.project.projectmanagement.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long>{


}
