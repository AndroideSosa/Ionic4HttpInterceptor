package mx.infotec.intranet.service;

import java.util.ArrayList;
import mx.infotec.intranet.domain.Area;
import mx.infotec.intranet.repository.AreaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import mx.infotec.intranet.repository.UserRepository;
import org.springframework.data.domain.Sort;

/**
 * Service Implementation for managing Area.
 */
@Service
public class AreaService {

    private final Logger log = LoggerFactory.getLogger(AreaService.class);

    private final AreaRepository areaRepository;
    
    private final UserRepository userRepository;

    public AreaService(AreaRepository areaRepository, UserRepository userRepository) {
        this.areaRepository = areaRepository;
        this.userRepository = userRepository;
    }

    /**
     * Save an area.
     *
     * @param area the entity to save
     * @return the persisted entity
     */
    public Area save(Area area) {
        log.debug("Request to save Area : {}", area);
        return areaRepository.save(area);
    }

    /**
     * Get all the areas.
     *
     * @return the list of entities
     */
    public List<Area> findAll() {
        log.debug("Request to get all Areas");
        return areaRepository.findAll();
    }

    /**
     * Get all the areas' names.
     *
     * @return the list of areas' names
     */
    public List<String> findAllAreasNames() {
        
        log.debug("Request to get all Areas' names");
        ArrayList<String> areasNames = new ArrayList<>(8);
        areaRepository.findAll(new Sort(Sort.Direction.ASC, "name")).forEach(area -> {
            areasNames.add(area.getName());
        });
        return areasNames;
    }

    /**
     * Get one area by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    public Optional<Area> findOne(String id) {
        log.debug("Request to get Area : {}", id);
        return areaRepository.findById(id);
    }

    /**
     * Delete the area by id.
     *
     * @param id the id of the entity
     * @return a boolean indicating whether or not the area was deleted
     */
    public boolean delete(String id) {
        
        log.debug("Request to delete Area : {}", id);
        boolean deleted = false;
        Optional<Area> area = areaRepository.findById(id);
        if (area.isPresent() && userRepository.findAllByArea(area.get()).size() > 0) {
            deleted = false;
        } else {
            areaRepository.deleteById(id);
            deleted = true;
        }
        return deleted;
    }
}
