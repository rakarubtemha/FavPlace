# FavPlace Proje Dokümantasyonu

Bu doküman, projede Docker, RabbitMQ ve Redis'in nasıl kullanıldığına dair detaylı bir açıklama ve proje gereksinimlerinin bir incelemesini sunmaktadır.

## Proje Gereksinimleri İncelemesi

Proje açıklamasına dayanarak, tamamlanan ve kalan adımların bir incelemesi aşağıda yer almaktadır:

-   **[Tamamlandı] Adım 1: Backend:** Backend, Next.js ile kurulmuş ve `lib/actions.ts` içinde sunucu tarafı eylemleri içermektedir.
-   **[Tamamlandı] Adım 2: REST API:** Uygulama, bir REST API görevi gören Next.js Sunucu Eylemlerini kullanmaktadır.
-   **[Devam Ediyor] Adım 3: CI/CD:** Bu adıma henüz başlanmadı.
-   **[Tamamlandı] Adım 4: Docker:** Uygulama Docker ile konteynerize edilmiştir.
-   **[Tamamlandı] Adım 5: RabbitMQ:** Asenkron mesajlaşma için RabbitMQ entegre edilmiştir.
-   **[Tamamlandı] Adım 6: Redis:** Önbellekleme için Redis entegre edilmiştir.
-   **[Başlanmadı] Adım 7: Alan Adı/Telefon:** Uygulama henüz bir alan adına dağıtılmadı.

## Uygulanan Adımların Detaylı Açıklaması

### Adım 4: Docker

Docker, uygulamayı konteynerize etmek için kullanılır, bu da onu taşınabilir ve herhangi bir ortamda çalıştırılması kolay hale getirir.

-   **Neden kullanıyoruz:** Docker, uygulamanın herhangi bir makinede aynı şekilde çalışmasını sağlayarak geliştirmeyi ve dağıtımı basitleştirir.
-   **Nasıl kullanılır:**
    -   **`Dockerfile`**, uygulamanın bir Docker imajını oluşturmak için talimatları içerir. Bağımlılıkları kurar, uygulamayı derler ve çalıştırma komutunu ayarlar.
    -   **`docker-compose.yml`** dosyası, uygulamayı oluşturan servisleri tanımlar: uygulamanın kendisi, RabbitMQ ve Redis. Tüm servisleri tek bir komutla çalıştırmamızı sağlar.
-   **Ne zaman olur:** `docker-compose up --build` komutunu çalıştırdığınızda Docker konteynerleri oluşturulur ve başlatılır.

### Adım 5: RabbitMQ

RabbitMQ, asenkron iletişim için kullanılan bir mesajlaşma aracısıdır.

-   **Neden kullanıyoruz:** Uzun süren görevleri arka plana atmamızı sağlar, böylece kullanıcının beklemesi gerekmez. Örneğin, yeni bir etkinlik oluşturulduğunda, kullanıcının isteğini engellemeden daha sonra işlenmek üzere bir kuyruğa mesaj gönderebiliriz.
-   **Nasıl kullanılır:**
    -   **`lib/rabbitmq.ts`** dosyası, RabbitMQ konteynerine bağlanan ve belirtilen bir kuyruğa mesaj gönderen `sendToQueue` fonksiyonunu içerir.
    -   **`lib/actions.ts`** içinde, `addEvent`, `createOrder` ve `createNewPost` fonksiyonları, yeni bir etkinlik, sipariş veya gönderi oluşturulduğunda bir kuyruğa mesaj göndermek için `sendToQueue` kullanır.
-   **Örnek Kullanım:**
    -   Bir kullanıcı `/panel/etkinlikler/ekle` sayfasında yeni bir etkinlik oluşturduğunda, `lib/actions.ts` içindeki `addEvent` fonksiyonu çağrılır. Bu fonksiyon, RabbitMQ'daki `event_created` kuyruğuna bir mesaj gönderir. Ayrı bir servis daha sonra bu kuyruğu dinleyerek kullanıcılara bildirim gönderme gibi eylemleri gerçekleştirebilir.

### Adım 6: Redis

Redis, önbellekleme için kullanılan bir bellek içi veri deposudur.

-   **Neden kullanıyoruz:** Sık erişilen verileri Redis'te önbelleğe almak, her seferinde veritabanını sorgulama ihtiyacını azaltarak uygulamanın performansını artırır.
-   **Nasıl kullanılır:**
    -   **`lib/redis.ts`** dosyası, Redis önbelleği ile etkileşim için `setCache` ve `getCache` fonksiyonlarını içerir. `REDIS_URL` ortam değişkenini kullanarak Redis konteynerine bağlanır.
-   **Örnek Kullanım:**
    -   Bir kullanıcı `/mekanlar` sayfasını ziyaret ettiğinde, uygulama önce mekan listesinin Redis önbelleğinde olup olmadığını kontrol edebilir. Eğer varsa, veriler Redis'ten döndürülür. Değilse, veriler veritabanından alınır, gelecekteki istekler için Redis önbelleğinde saklanır ve ardından kullanıcıya döndürülür.

## Uygulama Nasıl Çalıştırılır

Uygulamayı çalıştırmak için Docker ve Docker Compose'un kurulu olması gerekir. Ardından, terminalinizde aşağıdaki komutu çalıştırabilirsiniz:

```bash
docker-compose up --build
```

Bu, Docker imajlarını oluşturacak ve tüm konteynerleri başlatacaktır. Uygulama `http://localhost:3000` adresinde mevcut olacaktır.
