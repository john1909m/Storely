package com.spring.boot.mapper;

import com.spring.boot.dto.ProductDto;
import com.spring.boot.model.Product;
import com.spring.boot.model.ProductImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "imageUrls", expression = "java(mapUrls(product.getImages()))")
    @Mapping(target = "altText", expression = "java(mapAltTexts(product.getImages()))")
    @Mapping(target = "position", expression = "java(mapPositions(product.getImages()))")
    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "store.id", target = "storeId")
    ProductDto toProductDto(Product product);

    @Mapping(
            target = "images",
            expression = "java(mapImages(dto))"
    )
    @Mapping(source = "categoryId", target = "category.id")
    @Mapping(source = "storeId" , target="store.id")
    Product toProductEntity(ProductDto dto);

    default List<String> mapUrls(List<ProductImage> images) {
        if (images == null) return List.of();
        return images.stream()
                .map(ProductImage::getUrl)
                .toList();
    }

    default List<String> mapAltTexts(List<ProductImage> images) {
        if (images == null) return List.of();
        return images.stream()
                .map(ProductImage::getAltText)
                .toList();
    }

    default List<Integer> mapPositions(List<ProductImage> images) {
        if (images == null) return List.of();
        return images.stream()
                .map(ProductImage::getPosition)
                .toList();
    }

    default List<ProductImage> mapImages(ProductDto dto) {
        if (dto.getImageUrls() == null) return List.of();

        List<String> urls = dto.getImageUrls();
        List<String> altTexts = dto.getAltText();
        List<Integer> positions = dto.getPosition();

        return IntStream.range(0, urls.size())
                .mapToObj(i -> {
                    ProductImage image = new ProductImage();
                    image.setUrl(urls.get(i));

                    if (altTexts != null && altTexts.size() > i)
                        image.setAltText(altTexts.get(i));

                    if (positions != null && positions.size() > i)
                        image.setPosition(positions.get(i));

                    return image;
                })
                .toList();
    }

}