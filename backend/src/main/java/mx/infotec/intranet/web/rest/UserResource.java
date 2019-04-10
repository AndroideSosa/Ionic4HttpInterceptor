package mx.infotec.intranet.web.rest;


import mx.infotec.intranet.domain.User;
import mx.infotec.intranet.security.AuthoritiesConstants;
import mx.infotec.intranet.service.UserService;
import mx.infotec.intranet.web.rest.errors.*;
import mx.infotec.intranet.web.rest.util.HeaderUtil;
import mx.infotec.intranet.web.rest.vm.ManagedUserVM;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;

/**
 * REST controller for managing User.
 */
@RestController
@RequestMapping("/api")
public class UserResource {

    private final Logger log = LoggerFactory.getLogger(UserResource.class);

    private static final String ENTITY_NAME = "intranetUser";

    private final UserService userService;

    public UserResource(UserService userService) {
        this.userService = userService;
    }

    /**
     * POST  /register : register the user.
     *
     * @param managedUserVM the managed user View Model
     * @throws InvalidPasswordException 400 (Bad Request) if the password is incorrect
     * @throws EmailAlreadyUsedException 400 (Bad Request) if the email is already used
     * @throws LoginAlreadyUsedException 400 (Bad Request) if the login is already used
     */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void registerAccount(@Valid @RequestBody ManagedUserVM managedUserVM) {
        if (!checkPasswordLength(managedUserVM.getPassword())) {
            throw new InvalidPasswordException();
        }
        User user = userService.registerUser(managedUserVM, managedUserVM.getPassword());
    }

    /**
     * POST  /users : Create a new user.
     *
     * @param managedUserVM the user to create
     * @return the ResponseEntity with status 201 (Created) and with body the new user, or with status 400 (Bad Request) if the user has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/users")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\") or hasRole(\"" +
            AuthoritiesConstants.SYSADMIN + "\")")
    public ResponseEntity<User> createUser(@Valid @RequestBody ManagedUserVM managedUserVM)
            throws URISyntaxException {
        
        log.debug("REST request to save User : {}", managedUserVM);
        if (managedUserVM.getId() != null) {
            throw new BadRequestAlertException("A new user cannot already have an ID",
                    ENTITY_NAME, "idexists");
        }
        User result = userService.save(managedUserVM);
        return ResponseEntity.created(new URI("/api/users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * PUT  /users : Updates an existing user.
     *
     * @param managedUserVM the user to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated user,
     * or with status 400 (Bad Request) if the user is not valid,
     * or with status 500 (Internal Server Error) if the user couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/users")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\") or hasRole(\"" +
            AuthoritiesConstants.SYSADMIN + "\")")
    public ResponseEntity<User> updateUser(@Valid @RequestBody ManagedUserVM managedUserVM)
            throws URISyntaxException {
        
        log.debug("REST request to update User : {}", managedUserVM);
        if (managedUserVM.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        User result = userService.save(managedUserVM);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * GET  /userInfo : get all the users.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of users in body
     */
    @GetMapping("/userInfo")
    public ResponseEntity<User> getUserInfo() {
        log.debug("REST request to get a User's info");
        return ResponseUtil.wrapOrNotFound(userService.getUserInfo());
    }

    /**
     * GET  /users/:id : get the "id" user.
     *
     * @param id the id of the user to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the user, or with status 404 (Not Found)
     */
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser(@PathVariable String id) {
        log.debug("REST request to get User : {}", id);
        Optional<User> user = userService.findOne(id);
        return ResponseUtil.wrapOrNotFound(user);
    }

    /**
     * GET  /usersByArea/:id : get the "id" of the area.
     *
     * @param id the id of the area a group of users belong
     * @return the ResponseEntity with status 200 (OK) and with body the group of
     *     users that belong to that area, or with status 404 (Not Found)
     */
    @GetMapping("/usersByArea/{id}")
    public ResponseEntity<List<User>> getUsersByArea(@PathVariable String id) {
        
        log.debug("REST request to get Users of an area : {}", id);
        List<User> users = userService.findUsersOfArea(id);
        return ResponseUtil.wrapOrNotFound(Optional.of(users));
    }

    /**
     * DELETE  /users/:id : delete the "id" user.
     *
     * @param id the id of the user to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\") or hasRole(\"" +
            AuthoritiesConstants.SYSADMIN + "\")")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        log.debug("REST request to delete User : {}", id);
        userService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }
    
    private static boolean checkPasswordLength(String password) {
        return !StringUtils.isEmpty(password) &&
            password.length() >= ManagedUserVM.PASSWORD_MIN_LENGTH &&
            password.length() <= ManagedUserVM.PASSWORD_MAX_LENGTH;
    }
    
}
