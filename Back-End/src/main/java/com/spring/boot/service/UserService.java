package com.spring.boot.service;

import com.spring.boot.dto.UserDto;

import java.util.List;

public interface UserService {
    List<UserDto> getAllUsers();

    UserDto getUserById(Long id);

    UserDto getUserByName(String name);

    UserDto addUser(UserDto userDto);

    UserDto updateUser(UserDto userDto);

    void deleteUser(Long id);
}
