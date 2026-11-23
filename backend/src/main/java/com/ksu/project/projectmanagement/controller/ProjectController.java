package com.ksu.project.projectmanagement.controller;

import com.ksu.project.projectmanagement.model.Project;
import com.ksu.project.projectmanagement.repository.ProjectRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;



@RestController
@RequestMapping("api/projects")
public class ProjectController {

    private final ProjectRepository projectRepository;

    public ProjectController(ProjectRepository projectRepository){
        this.projectRepository = projectRepository;
    }

    //Get all projects
    @GetMapping
    public List<Project> getAllProjects(){
        return projectRepository.findAll();
    }

    //Get a project by ID
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return projectRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //creates a project
    @PostMapping
    public Project createProject(@RequestBody Project project){
        return projectRepository.save(project);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project updatedProject) {
        return projectRepository.findById(id)
                .map(existing -> {
                    if (updatedProject.getName() != null && !updatedProject.getName().isBlank()) {
                        existing.setName(updatedProject.getName());
                    }
                    if (updatedProject.getDescription() != null) {
                        existing.setDescription(updatedProject.getDescription());
                    }
                    if (updatedProject.getOwnerName() != null && !updatedProject.getOwnerName().isBlank()) {
                        existing.setOwnerName(updatedProject.getOwnerName());
                    }
                    return ResponseEntity.ok(projectRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    //delete a project
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        if (!projectRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        projectRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }


}
