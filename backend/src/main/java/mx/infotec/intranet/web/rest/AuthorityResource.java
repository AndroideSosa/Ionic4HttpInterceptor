package mx.infotec.intranet.web.rest;
import mx.infotec.intranet.domain.Authority;
import mx.infotec.intranet.service.AuthorityService;
import mx.infotec.intranet.web.rest.errors.BadRequestAlertException;
import mx.infotec.intranet.web.rest.util.HeaderUtil;
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
import mx.infotec.intranet.security.AuthoritiesConstants;
import org.springframework.security.access.prepost.PreAuthorize;

/**
 * REST controller for managing Authority.
 */
@RestController
@RequestMapping("/api")
public class AuthorityResource {

    private final Logger log = LoggerFactory.getLogger(AuthorityResource.class);

    private static final String ENTITY_NAME = "intranetAuthority";

    private final AuthorityService authorityService;

    public AuthorityResource(AuthorityService authorityService) {
        this.authorityService = authorityService;
    }

    /**
     * POST  /authorities : Create a new authority.
     *
     * @param authority the authority to create
     * @return the ResponseEntity with status 201 (Created) and with body the new authority,
     *         or with status 400 (Bad Request) if the authority has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/authorities")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.SYSADMIN + "\")")
    public ResponseEntity<Authority> createAuthority(@Valid @RequestBody Authority authority)
            throws URISyntaxException {
        
        log.debug("REST request to save Authority : {}", authority);
        if (authority.getId() != null) {
            throw new BadRequestAlertException("A new authority cannot already have an ID",
                    ENTITY_NAME, "idexists");
        }
        Authority result = authorityService.save(authority);
        return ResponseEntity.created(new URI("/api/authorities/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * PUT  /authorities : Updates an existing authority.
     *
     * @param authority the authority to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated authority,
     * or with status 400 (Bad Request) if the authority is not valid,
     * or with status 500 (Internal Server Error) if the authority couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/authorities")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.SYSADMIN + "\")")
    public ResponseEntity<Authority> updateAuthority(@Valid @RequestBody Authority authority)
            throws URISyntaxException {
        
        log.debug("REST request to update Authority : {}", authority);
        if (authority.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Authority result = authorityService.save(authority);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, authority.getId()))
            .body(result);
    }

    /**
     * GET  /authorities : get all the authorities.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of authorities in body
     */
    @GetMapping("/authorities")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.SYSADMIN + "\")")
    public List<Authority> getAllAuthorities() {
        log.debug("REST request to get all Authorities");
        return authorityService.findAll();
    }

    /**
     * GET  /authorities/:id : get the "id" authority.
     *
     * @param id the id of the authority to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the authority,
     *         or with status 404 (Not Found)
     */
    @GetMapping("/authorities/{id}")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.SYSADMIN + "\")")
    public ResponseEntity<Authority> getAuthority(@PathVariable String id) {
        log.debug("REST request to get Authority : {}", id);
        Optional<Authority> authority = authorityService.findOne(id);
        return ResponseUtil.wrapOrNotFound(authority);
    }

    /**
     * DELETE  /authorities/:id : delete the "id" authority.
     *
     * @param id the id of the authority to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/authorities/{id}")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.SYSADMIN + "\")")
    public ResponseEntity<Void> deleteAuthority(@PathVariable String id) {
        log.debug("REST request to delete Authority : {}", id);
        authorityService.delete(id);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id))
                .build();
    }
}
