# Projekt e-demokracja
Projekt e-demokracja to projekt mający na celu pokazanie, że zarówno Obywatele jak i Administracja Publiczna są gotowi, aby składać wszelkiego rodzaju podpisy elektronicznie, przez Internet.
Nie ma żadnych technicznych przeszkód, aby posługiwać się Podpisem Zaufanym składając podpisy pod obywatelskimi inicjatywami ustawodawczymi przez Internet.
To samo dotyczy wniosków o referendum czy różnego rodzaju samych już referendów, w tym lokalnych, stanowiących bardzo ważny element demokracji bezpośredniej.
Analogicznie dla list poparcia dla partii itd.

**Słowom ministra Gramatyki z dnia 07.02.2024: "Jedyną barierą, która w dniu dzisiejszym oddziela nas od tworzenia takich systemów jest rozporządzenie eIDAS 2" brakuje przekonującej argumentacji**. Ciężko nie odnieść wrażenia, że **jeżeli już czegokolwiek brakuje, to większej determinacji i przychylności ze strony ustawodawcy.**

# Idea
W zależności od tego, czy posiada się dostęp do serwerów administracji publicznej oferujących integrację z serwerami Podpisu Zaufanego czy nie:
1. [bez integracji] wystarczy postawić prostą stronę WWW z której obywatele ściągają dany dokument, podpisują go Podpisem Zaufanym a następnie uploadują. I organizacja, która za tym stoi, wszystkie te podpisane pliki wysyła do danego organu administracji publicznej. Ta idea przyświeca projektowi e-demokracja w tym repozytorium.
2. [z integracją] to co powyżej, ale administracja publiczna daje dostępy do serwerów oferujących Podpis Zaufany tak, aby się zintegrować jak to zrobił Kraków, gdzie można poprzez Podpis Zaufany głosować za Obywatelskimi Inicjatywami Ustawodawczymi (i to jest JUŻ w użyciu).

# Projekt e-petycje jako implementacja e-demokracji
Projekt [e-petycje](./e-petitions) to bardzo prosty projekt strony WWW (+część serwerowa w chmurze AWS) wg idei z punktu 1. Wg prawa petycje nie muszą być podpisywane poprzez Podpis Zaufany,
niemniej jednak jest to świetny sposób aby pokazać prostotę idea użycia Podpisu Zaufanego przez obywateli. Każdy może sobie pobrać petycję, podpisać ją Podpisem Zaufanym i odesłać. My na prawdę jesteśmy już od dawna gotowi na podpisy przez Internet!

Poniżej wygląd strony WWW dla przykładowej e-petycji - prawda, że proste?
![e-petycje WWW](./e-petycje%20WWW.png)

# Dodatkowa lektura:
- stanowisko rządu w [artykule Instytutu Spraw Obywatelskich](https://instytutsprawobywatelskich.pl/swiatelko-w-tunelu-rzadowym-obywatelska-inicjatywa-ustawodawcza-w-senacie/?fbclid=IwAR34deEucpZsz1JXhpy0tvhn_MHhJsjbQNjjcKLt3ALNJN_pDbmYuHNL-oU)
- [dla programistów] kod w tym repozytorium
- [dla programistów/osób pracujących nad tego typu projektami] oprócz treści ustaw, [wymagania odnośnie petycji składanych do sejmu ustalone telefonicznie z kancelarią sejmu](https://referenda.pl/newsy/czy-istnieje-mozliwosci-zautomatyzowania-wysylania-petycji-podpisanych-przez-ambasadorow-w-sposob-elektroniczny/)
