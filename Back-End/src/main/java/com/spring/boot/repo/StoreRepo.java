package com.spring.boot.repo;

import com.spring.boot.model.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StoreRepo extends JpaRepository<Store, UUID> {
    Optional<Store> findStoreByStoreName(String storeName);

    Optional<Store> findStoreByVendor_Id(UUID vendorId);

    Optional<Store> findStoreByVendor_Name(String vendorName);

    @Query(value = """
        SELECT 
            s.id,
            s.store_name,
            s.store_address,
            s.store_description,
            s.store_phone,
            s.store_logo_url,
            s.total_visits,
            s.store_status,
            s.created_at,
            s.primary_color,
            s.secondary_color,
            s.theme_type,
            s.font_family,
            s.facebook,
            s.instagram,
            v.id as vendor_id,
            v.name as vendor_name,
            v.email as vendor_email,
            v.phone as vendor_phone,
            COUNT(DISTINCT p.id) as products_count,
            COUNT(DISTINCT o.id) as orders_count
        FROM stores s
        LEFT JOIN vendor v ON s.vendor_id = v.id
        LEFT JOIN products p ON s.id = p.store_id
        LEFT JOIN orders o ON s.id = o.store_id
        GROUP BY 
            s.id, s.store_name, s.store_address, s.store_description, 
            s.store_phone, s.store_logo_url, s.total_visits, s.store_status,
            s.created_at, s.primary_color, s.secondary_color, s.theme_type,
            s.font_family, s.facebook, s.instagram, v.id, v.name, v.email, v.phone
        ORDER BY s.created_at DESC
        """, nativeQuery = true)
    List<Object[]> findAllStoresWithStats();
}
