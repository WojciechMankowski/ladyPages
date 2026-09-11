# Jak zamienić wiadomość na zadanie w Planner? 

## Wstęp
- wymagania wstępne
## Tworzenie zespołu w Teams
1. Otwórz listę zespołów. Jeśli masz połączone czaty i zespoły, znajdziesz je w 2. zakładce Czat. Jeśli masz je rozdzielone, wejdź w osobną zakładkę Zespoły.
3. Obok napisu Zespoły kliknij ikonę kartki z długopisem.
4. Wybierz Nowy zespół.
5. Nadaj nazwę.
6. Zostaw zespół jako prywatny. Ludzi zaprosisz później.
7. Nazwij pierwszy kanał, na przykład Ogólny.
8. Kliknij Utwórz.

Nie masz uprawnień do tworzenia zespołów albo nie chcesz zakładać nowego? Użyj zespołu, w którym już jesteś członkiem. Reszta instrukcji działa tak samo.

Zespół jest gotowy. Teraz dodaj do niego Planner.

## Tworzenia Plannera
Wejdź na https://planner.cloud.microsoft/webui/myplans. Kliknij tworzenie nowego planu, wybierz Plan podstawowy i potwierdź przyciskiem Utwórz plan podstawowy. Wpisz nazwę planu, a w polu „Udostępnij swojej grupie" wybierz z listy zespół stworzony przed chwilą. Tego pola nie pomijaj. Bez niego plan trafia do twoich zadań osobistych, a przepływ z Teams go nie zobaczy. Kliknij Utwórz plan podstawowy. Plan pojawi się też w Teams, w zakładce twojego zespołu.

## Tworzenie przepływu

Kolejnym krokiem jest wejście do Teams. Wybierz jedną ze swoich wiadomości, tę, z której chcesz stworzyć zadanie w Plannerze. Wykonaj następujące kroki:

1. Najedź na wiadomość, pojawi się pasek z emotkami reakcji.
2. Kliknij ikonę trzech kropek.
3. Wybierz Więcej działań.
4. Wybierz Utwórz przepływ pracy.
5. Wybierz szablon „Utwórz zadanie w programie Planner na podstawie wiadomości".
6. Wybierz grupę (patrz punkt 2 przy tworzeniu strony).
7. Wybierz planer.

## Testowanie

Mam gotowy przepływ, czas go przetestować. Najedź na wybraną wiadomość, od razu powinieneś zauważyć przepływ o nazwie „Utwórz zadanie w programie Planner na podstawie wiadomości".

Jeśli nie zauważysz go w tym miejscu, najedź na Więcej działań i szukaj pod tą samą nazwą.

Kliknij w niego i uzupełnij dane w wyskakującym oknie. Teraz przejdź w Teams do aplikacji Planner i sprawdź, czy zadanie na podstawie wiadomości zostało dodane.
## Błędy jak je rozwiązać 
## Częste błędy

1. Grupa nie ma jeszcze planu w Plannerze. Szablon szuka istniejącego planu przypiętego do zespołu, jeśli go nie ma, lista planów w kroku 7 jest pusta.

2. Kanał prywatny blokuje akcję. „Utwórz przepływ pracy" z wiadomości w kanale prywatnym często kończy się błędem uprawnień, bo połączenie Teams-Planner nie ma dostępu do takich kanałów.

3. Polityka DLP blokuje połączenie konektorów. Administrator może ustawić regułę Data Loss Prevention, która nie pozwala łączyć konektora Teams z Plannerem w jednym przepływie, wtedy zapis kończy się błędem.

4. Usunięcie wiadomości nie usuwa zadania. Zadanie w Plannerze i wiadomość w Teams nie są ze sobą powiązane po utworzeniu, skasowanie jednego nie wpływa na drugie.

5. Edycja wiadomości nie aktualizuje zadania. Opis zadania w Plannerze zostaje z treścią sprzed edycji, bo przepływ pobiera dane tylko raz, w momencie uruchomienia.

6. Kilkukrotne uruchomienie na tej samej wiadomości tworzy duplikaty. Teams nie sprawdza, czy zadanie z danej wiadomości już istnieje, więc powtórne kliknięcie „Utwórz przepływ pracy" doda drugie, identyczne zadanie.

7. Limit uruchomień w licencji. Przepływy z akcji na wiadomości liczą się do miesięcznego limitu w planie Power Automate, przy niskim planie licencyjnym (np. w ramach Microsoft 365) można go wyczerpać przy dużej liczbie zgłoszeń.

## Jak dopasować szablon do własnych potrzeb: 
- Treść zadania po polsku a nie po angielsku 
- Dodanie daty rozpoczęcia np. Od dziś, od jutra 
- 
## Zakończenie