package mx.infotec.intranet.repository;

import mx.infotec.intranet.domain.Authority;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


/**
 * Spring Data MongoDB repository for the Authority entity.
 */
@Repository
public interface AuthorityRepository extends MongoRepository<Authority, String> {

    /*Obtiene un documento cuyo nombre del rol es igual al recibido*/
    public Authority findOneByRole(String role);
}
