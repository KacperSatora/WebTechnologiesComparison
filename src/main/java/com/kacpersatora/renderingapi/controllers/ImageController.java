package com.kacpersatora.renderingapi.controllers;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
public class ImageController {

    private final byte[] imageBytes;

    public ImageController() throws IOException {
        var imgResource = new ClassPathResource("puppy.jpg");
        try (var is = imgResource.getInputStream()) {
            this.imageBytes = is.readAllBytes();
        }
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/image")
    public ResponseEntity<byte[]> getImage() {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_JPEG_VALUE)
                .header(HttpHeaders.CACHE_CONTROL, "no-store, no-cache, must-revalidate")
                .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(imageBytes.length))
                .body(imageBytes);
    }
}
