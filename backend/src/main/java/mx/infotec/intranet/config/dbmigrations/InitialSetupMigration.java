package mx.infotec.intranet.config.dbmigrations;


import com.github.mongobee.changeset.ChangeLog;
import com.github.mongobee.changeset.ChangeSet;
import java.time.Instant;
import org.springframework.data.mongodb.core.MongoTemplate;

import mx.infotec.intranet.domain.Authority;
import mx.infotec.intranet.domain.User;
import mx.infotec.intranet.security.AuthoritiesConstants;


/**
 * Crea la configuracion inicial en la base de datos. 3 instancias de roles y un usuario
 * con permisos de administracion del sistema
 */
@ChangeLog(order = "001")
public class InitialSetupMigration {
    
    @ChangeSet(order = "01", author = "initiator", id = "01-addALL")
    public void addAuthorities(MongoTemplate mongoTemplate) {
        Authority adminAuthority = new Authority();
        adminAuthority.setRole(AuthoritiesConstants.ADMIN);
        Authority userAuthority = new Authority();
        userAuthority.setRole(AuthoritiesConstants.USER);
        Authority sysAdminAuthority = new Authority();
        sysAdminAuthority.setRole(AuthoritiesConstants.SYSADMIN);
        mongoTemplate.save(adminAuthority);
        mongoTemplate.save(userAuthority);
        mongoTemplate.save(sysAdminAuthority);
        
        User systemUser = new User();
        systemUser.setId("user-0");
        systemUser.setName("SysAdmin");
        //Password: sysadmin
        systemUser.setPassword("$2a$10$w7C3nssXyiKzswjtAYbT4Oh5wOCtIDYucot.JsNWlPm/3noa3s4H.");
        systemUser.setPhone("0000");
        systemUser.setEmail("sysadmin@localhost");
        systemUser.setJob("Administración del Sistema");
        systemUser.setCreatedBy(systemUser.getName());
        systemUser.setCreatedDate(Instant.now());
        systemUser.getAuthorities().add(sysAdminAuthority);
        mongoTemplate.save(systemUser);
    }
    
}
