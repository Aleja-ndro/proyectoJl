package com.example.demo.controller;

import com.example.demo.entity.Producto;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.repository.ProductoRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/productos")
public class ProductoController {
    @Autowired
    private ProductoRepository repository;

    @GetMapping("/test")
    public List<Producto> getAll() {
        return repository.findAll();
    }

    @GetMapping("/buscar")
    public List<Producto> buscarPorDescripcion(@RequestParam String keyword) {
        return repository.findByDescripcionContainingIgnoreCase(keyword);
    }

    @PostMapping("/agregar")
    public Producto agregarProducto(@RequestBody Producto nuevProducto) {
        return repository.save(nuevProducto);
    }

}
