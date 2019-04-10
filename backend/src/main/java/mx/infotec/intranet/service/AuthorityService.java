package mx.infotec.intranet.service;

import mx.infotec.intranet.domain.Authority;
import mx.infotec.intranet.repository.AuthorityRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing Authority.
 */
@Service
public class AuthorityService {

    private final Logger log = LoggerFactory.getLogger(AuthorityService.class);

    private final AuthorityRepository authorityRepository;

    public AuthorityService(AuthorityRepository authorityRepository) {
        this.authorityRepository = authorityRepository;
    }

    /**
     * Save a authority.
     *
     * @param authority the entity to save
     * @return the persisted entity
     */
    public Authority save(Authority authority) {
        log.debug("Request to save Authority : {}", authority);
        return authorityRepository.save(authority);
    }

    /**
     * Get all the authorities.
     *
     * @return the list of entities
     */
    public List<Authority> findAll() {
        log.debug("Request to get all Authorities");
        return authorityRepository.findAll();
    }


    /**
     * Get one authority by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    public Optional<Authority> findOne(String id) {
        log.debug("Request to get Authority : {}", id);
        return authorityRepository.findById(id);
    }

    /**
     * Delete the authority by id.
     *
     * @param id the id of the entity
     */
    public void delete(String id) {
        log.debug("Request to delete Authority : {}", id);        authorityRepository.deleteById(id);
    }
}
