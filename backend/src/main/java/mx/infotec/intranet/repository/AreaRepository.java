package mx.infotec.intranet.repository;

import mx.infotec.intranet.domain.Area;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


/**
 * Spring Data MongoDB repository for the Area entity.
 */
@Repository
public interface AreaRepository extends MongoRepository<Area, String> {

    /*Obtiene un documento cuyo nombre es igual a la cadena recibida */
    public Area findOneByName(String name);
    
}
