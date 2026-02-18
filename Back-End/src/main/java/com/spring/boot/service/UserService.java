package com.spring.boot.service;

import com.spring.boot.dto.UserDto;

import java.util.List;
import java.util.UUID;

public interface UserService {
    List<UserDto> getAllUsers();

    UserDto getUserById(UUID id);

    UserDto getUserByName(String name);

    UserDto addUser(UserDto userDto);

    UserDto updateUser(UserDto userDto);

    void deleteUser(UUID id);
}
