package mx.infotec.intranet.service;

import java.util.HashSet;
import mx.infotec.intranet.domain.User;
import mx.infotec.intranet.domain.Area;
import mx.infotec.intranet.domain.Authority;
import mx.infotec.intranet.repository.AuthorityRepository;
import mx.infotec.intranet.repository.AreaRepository;
import mx.infotec.intranet.repository.UserRepository;
import mx.infotec.intranet.service.dto.UserDTO;
import mx.infotec.intranet.security.SecurityUtils;
import mx.infotec.intranet.web.rest.errors.EmailAlreadyUsedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import mx.infotec.intranet.web.rest.vm.ManagedUserVM;
import org.springframework.cache.CacheManager;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Service Implementation for managing User.
 */
@Service
public class UserService {

    private final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;
    
    private final AuthorityRepository authorityRepository;
    
    private final AreaRepository areaRepository;
    
    private final CacheManager cacheManager;
    
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
            AuthorityRepository authorityRepository, AreaRepository areaRepository,
            CacheManager cacheManager) {
        
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authorityRepository = authorityRepository;
        this.areaRepository = areaRepository;
        this.cacheManager = cacheManager;
    }

    /**
     * Registra nuevos usuarios en la BD. Llamado desde UserResource.
     * @param userDTO informacion del nuevo usuario a persistir
     * @param password contraseña a asignar al usuario
     * @return 
     */
    public User registerUser(UserDTO userDTO, String password) {
        
        userRepository.findOneByEmailIgnoreCase(userDTO.getEmail()).ifPresent(existingUser -> {
            throw new EmailAlreadyUsedException();
        });
        
        User newUser = this.userDTO2User(userDTO);
        User savedUser = null;
        String encryptedPassword = passwordEncoder.encode(password);
        // new user gets initially a generated password
        newUser.setPassword(encryptedPassword);
        savedUser = userRepository.save(newUser);
        this.clearUserCaches(newUser);
        log.debug("Created Information for User: {}", savedUser);
        return savedUser;
    }
    
    /**
     * Save a user.
     *
     * @param managedUserVM the entity to save
     * @return the persisted entity
     */
    public User save(ManagedUserVM managedUserVM) {
        
        log.debug("Request to save User : {}", managedUserVM);
        User user = this.userDTO2User(managedUserVM);
        User savedUser = null;
        if (null == user.getId() || user.getId().isEmpty()) {
            String encryptedPassword = passwordEncoder.encode(managedUserVM.getPassword());
            user.setPassword(encryptedPassword);
            savedUser = userRepository.save(user);
        } else {
            Optional<User> existentUser = userRepository.findById(user.getId());
            if (existentUser.isPresent()) {
                User oldUser = existentUser.get();
                oldUser.setName(user.getName());
                oldUser.setEmail(user.getEmail());
                oldUser.setPhone(user.getPhone());
                oldUser.setArea(user.getArea());
                oldUser.setJob(user.getJob());
                oldUser.setAuthorities(user.getAuthorities());
                oldUser.setSkills(user.getSkills());
                savedUser = userRepository.save(oldUser);
                this.clearUserCaches(savedUser);
            }
        }
        return savedUser;
    }

    /**
     * Get all the users.
     *
     * @return the list of entities
     */
    public List<User> findAll() {
        log.debug("Request to get all Users");
        return userRepository.findAll();
    }

    /**
     * Obtiene el grupo de usuarios asociados a un area
     * @param areaId el identificador del area
     * @return un listado de los usuarios asignados al area especificada
     */
    public List<User> findUsersOfArea(String areaId) {
        
        log.debug("Request to get an area's Users");
        Optional<Area> area;
        List<User> users = null;
        if (areaId.length() == 24) {
            //por id de area:
            area = areaRepository.findById(areaId);
        } else {
            Area areaByName = areaRepository.findOneByName(areaId);
            area = Optional.ofNullable(areaByName);
        }
        if (area.isPresent()) {
            Area theArea = area.get();
            users = userRepository.findAllByArea(theArea);
        }
        return users;
    }

    /**
     * Get one user by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    public Optional<User> findOne(String id) {
        log.debug("Request to get User : {}", id);
        return userRepository.findById(id);
    }
    
    /**
     * Gets the info for the user on session
     * @return a User object whose email equals the one registered on session
     */
    public Optional<User> getUserInfo() {
        
        log.debug("Request to get the User's info");
        Optional<String> email = SecurityUtils.getCurrentUserLogin();
        Optional<User> theUser = Optional.empty();
        if (email.isPresent()) {
            theUser = userRepository.findOneByEmailIgnoreCase(email.get());
        }
        return theUser;
    }

    /**
     * Delete the user by id.
     *
     * @param id the id of the entity
     */
    public void delete(String id) {
        log.debug("Request to delete User : {}", id);
        userRepository.deleteById(id);
    }
    
    private void clearUserCaches(User user) {
        Objects.requireNonNull(cacheManager.getCache(UserRepository.USERS_BY_EMAIL_CACHE))
                .evict(user.getEmail());
    }
    
    /**
     * Conversion de un objeto UserDTO a una instancia de User
     * @param userDTO representacion del objeto a convertir
     * @return una nueva instancia de tipo User con la informacion del objeto recibido
     */
    private User userDTO2User(UserDTO userDTO) {
        
        User user = new User();
        user.setId(userDTO.getId());
        user.setEmail(userDTO.getEmail());
        user.setName(userDTO.getName());
        user.setPhone(userDTO.getPhone());
        user.setJob(userDTO.getJob());
        user.setSkills(userDTO.getSkills());
        if (null != userDTO.getArea() ) {  //&& !userDTO.getArea().isEmpty()
            Area area = areaRepository.findOneByName(userDTO.getArea());
            if (null != area) {
                user.setArea(area);
            }
        }
        Set<Authority> authorities = new HashSet<>();
        userDTO.getAuthorities().forEach(role -> {
            Authority authority = authorityRepository.findOneByRole(role);
            authorities.add(authority);
        });
        user.setAuthorities(authorities);
        return user;
    }
}
