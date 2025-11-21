import { ConfigType, FileConfig } from './types';

export const INITIAL_FILES: Record<string, FileConfig> = {
  'named-conf-local': {
    id: 'named-conf-local',
    type: ConfigType.NAMED_CONF,
    name: 'named.conf.local',
    description: 'Main zone configuration file',
    content: `//
// named.conf.local
//

zone "example.com" {
    type master;
    file "/etc/bind/db.example.com";
};

zone "1.168.192.in-addr.arpa" {
    type master;
    file "/etc/bind/db.192.168.1";
};`
  },
  'db-forward': {
    id: 'db-forward',
    type: ConfigType.FORWARD_ZONE,
    name: 'db.example.com',
    description: 'Forward lookup zone file',
    content: `;
; BIND data file for example.com
;
$TTL    604800
@       IN      SOA     ns1.example.com. admin.example.com. (
                              2         ; Serial
                         604800         ; Refresh
                          86400         ; Retry
                        2419200         ; Expire
                         604800 )       ; Negative Cache TTL
;
@       IN      NS      ns1.example.com.
@       IN      A       192.168.1.10
ns1     IN      A       192.168.1.10
www     IN      CNAME   example.com.`
  },
  'db-reverse': {
    id: 'db-reverse',
    type: ConfigType.REVERSE_ZONE,
    name: 'db.192.168.1',
    description: 'Reverse lookup zone file',
    content: `;
; BIND reverse data file for local loopback interface
;
$TTL    604800
@       IN      SOA     ns1.example.com. admin.example.com. (
                              1         ; Serial
                         604800         ; Refresh
                          86400         ; Retry
                        2419200         ; Expire
                         604800 )       ; Negative Cache TTL
;
@       IN      NS      ns1.example.com.
10      IN      PTR     ns1.example.com.
10      IN      PTR     example.com.`
  }
};

export const FILE_TEMPLATES: Record<ConfigType, string> = {
  [ConfigType.NAMED_CONF]: `// New configuration file
zone "new.zone" {
    type master;
    file "/etc/bind/db.new";
};`,
  [ConfigType.FORWARD_ZONE]: `; Forward zone file
$TTL    604800
@       IN      SOA     ns1.example.com. admin.example.com. (
                              1         ; Serial
                         604800         ; Refresh
                          86400         ; Retry
                        2419200         ; Expire
                         604800 )       ; Negative Cache TTL
;
@       IN      NS      ns1.example.com.
@       IN      A       127.0.0.1`,
  [ConfigType.REVERSE_ZONE]: `; Reverse zone file
$TTL    604800
@       IN      SOA     ns1.example.com. admin.example.com. (
                              1         ; Serial
                         604800         ; Refresh
                          86400         ; Retry
                        2419200         ; Expire
                         604800 )       ; Negative Cache TTL
;
@       IN      NS      ns1.example.com.
1       IN      PTR     ns1.example.com.`
};

export const MOCK_GEMINI_RESPONSE_VALID = `{"isValid": true, "errors": [], "generalFeedback": "Configuration looks correct."}`;
