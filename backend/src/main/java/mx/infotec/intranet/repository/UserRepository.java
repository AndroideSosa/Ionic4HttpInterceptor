package mx.infotec.intranet.repository;

import java.util.List;
import java.util.Optional;
import mx.infotec.intranet.domain.Area;
import mx.infotec.intranet.domain.User;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


/**
 * Spring Data MongoDB repository for the User entity.
 */
@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    
    String USERS_BY_EMAIL_CACHE = "usersByEmail";

    /*Obtiene un documento cuyo correo electronico es igual al recibido*/
    @Cacheable(cacheNames = USERS_BY_EMAIL_CACHE)
    public Optional<User> findOneByEmailIgnoreCase(String email);

    /*Obtiene un conjunto de documentos cuya area asociada es la recibida*/
    public List<User> findAllByArea(Area area);
}
