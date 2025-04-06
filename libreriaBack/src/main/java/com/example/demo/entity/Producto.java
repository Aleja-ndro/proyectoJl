package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

import com.example.demo.util.BigDecimalSerializer;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "\"Producto\"")
public class Producto {

    @Id
    @Column(name = "\"Codigo\"")
    private Long codigo;

    @Column(name = "\"Rubro\"")
    private String rubro;

    @Column(name = "\"Descripcion\"")
    private String descripcion;

    @Column(name = "\"Marca\"")
    private String marca;

    @Column(name = "\"PrecioCompra\"", columnDefinition = "NUMERIC(12,2)")
    @JsonSerialize(using = BigDecimalSerializer.class)
    private BigDecimal precioCompra;

    @Column(name = "\"PrecioVenta\"", columnDefinition = "NUMERIC (12,2)")
    @JsonSerialize(using = BigDecimalSerializer.class)
    private BigDecimal precioVenta;

    @Column(name = "\"Stock\"")
    private Double stock;

    @Column(name = "\"StockMinimo\"")
    private String stockminimo;

    @Column(name = "\"AlicuotaIva\"")
    private String alicuotaIva;

    @Column(name = "\"CodigoProv\"")
    private String codigoProv;

}
