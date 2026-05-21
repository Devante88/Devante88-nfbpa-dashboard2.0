const {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef
} = React;

// ── PERSISTENCE ───────────────────────────────────────────────────────────────
const SK = 'nfbpa_v14';
function load(k, fb) {
  try {
    const r = localStorage.getItem(SK + '_' + k);
    return r ? JSON.parse(r) : fb;
  } catch {
    return fb;
  }
}
function save(k, v) {
  try {
    localStorage.setItem(SK + '_' + k, JSON.stringify(v));
  } catch {}
}

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const BOARD = [{
  id: 1,
  name: 'Cherrelle Duncan',
  role: 'President',
  email: 'president@nfbpahoustontx.org'
}, {
  id: 2,
  name: 'Dr. Ericka Brown',
  role: '1st Vice President',
  email: 'vicepresident@nfbpahoustontx.org'
}, {
  id: 3,
  name: 'Gethorio Davidson',
  role: '2nd VP of Programs',
  email: 'secondvicepresident@nfbpahoustontx.org'
}, {
  id: 4,
  name: 'Danita Collins',
  role: 'Treasurer',
  email: 'treasurer@nfbpahoustontx.org'
}, {
  id: 5,
  name: 'Rachel Gutierrez',
  role: 'Secretary',
  email: 'secretary@nfbpahoustontx.org'
}, {
  id: 6,
  name: 'Deja Evans',
  role: 'Assistant Secretary',
  email: 'assistantsecretary@nfbpahoustontx.org'
}, {
  id: 7,
  name: 'Danny Norris',
  role: 'Parliamentarian',
  email: 'parliamentarian@nfbpahoustontx.org'
}, {
  id: 8,
  name: 'Simone Wilson',
  role: 'Advisor',
  email: 'ExecutiveBoardMembers@nfbpahoustontx.org'
}, {
  id: 9,
  name: 'Brandon Denton',
  role: 'Immediate Past President',
  email: 'ExecutiveBoardMembers@nfbpahoustontx.org'
}, {
  id: 10,
  name: 'Dr. Kimberly Henderson',
  role: 'Scholarship Chair',
  email: 'ExecutiveBoardMembers@nfbpahoustontx.org'
}, {
  id: 11,
  name: 'Roselynn Ruth',
  role: 'Membership Chair',
  email: 'ExecutiveBoardMembers@nfbpahoustontx.org'
}];
// All official NFBPA Greater Houston email addresses — verified list
// Used as FROM options in EmailComposer; select from list or enter external address
const NFBPA_EMAILS = [{
  label: 'Executive Board (All Members)',
  value: 'ExecutiveBoardMembers@nfbpahoustontx.org'
}, {
  label: 'President — Cherrelle Duncan',
  value: 'president@nfbpahoustontx.org'
}, {
  label: 'Vice President — Dr. Ericka Brown',
  value: 'vicepresident@nfbpahoustontx.org'
}, {
  label: '2nd Vice President — Gethorio Davidson',
  value: 'secondvicepresident@nfbpahoustontx.org'
}, {
  label: 'Treasurer — Danita Collins',
  value: 'treasurer@nfbpahoustontx.org'
}, {
  label: 'Secretary — Rachel Gutierrez',
  value: 'secretary@nfbpahoustontx.org'
}, {
  label: 'Assistant Secretary — Deja Evans',
  value: 'assistantsecretary@nfbpahoustontx.org'
}, {
  label: 'Parliamentarian — Danny Norris',
  value: 'parliamentarian@nfbpahoustontx.org'
}, {
  label: 'Financial Secretary',
  value: 'financialsecretary@nfbpahoustontx.org'
}, {
  label: 'Anniversary Chair',
  value: 'anniversary@nfbpahoustontx.org'
}];
const BOARD_EMAILS = NFBPA_EMAILS; // kept for backwards compatibility

const CHANNELS_12 = [{
  name: 'Individual Membership',
  target: 15000,
  category: 'Membership'
}, {
  name: 'Corporate Membership',
  target: 12000,
  category: 'Membership'
}, {
  name: '40 for 40 Campaign',
  target: 1600,
  category: 'Membership'
}, {
  name: 'TSU Student Dues',
  target: 350,
  category: 'Membership'
}, {
  name: 'Associate Memberships',
  target: 2200,
  category: 'Membership'
}, {
  name: 'Annual Gala',
  target: 20000,
  category: 'Events'
}, {
  name: 'PD Workshop Series',
  target: 8000,
  category: 'Events'
}, {
  name: 'Awards Luncheon',
  target: 6000,
  category: 'Events'
}, {
  name: 'Sponsorships',
  target: 26600,
  category: 'Sponsorship'
}, {
  name: 'Grant Revenue',
  target: 3000,
  category: 'Grants'
}, {
  name: 'Merchandise & Misc',
  target: 1545,
  category: 'Other'
}, {
  name: 'Interest / Investment',
  target: 1000,
  category: 'Other'
}];
const RAW_SUSPENDED = [['Adams', 'Amber', 'amber.adams@noemail.com', '5/31/2010', 'S'], ['Adams', 'Michael', 'adams_mo@tsu.edu', '2/28/2014', 'S'], ['Adams', 'Vicky', 'vickyladams@yahoo.com', '5/31/2022', 'S'], ['Ahaele', 'Destiny', 'destiny.ahaele@tsu.edu', '5/31/2022', 'S'], ['Aisabokhae', 'Stephen', 'saisabokhae@student.pvamu.edu', '1/31/2021', 'S'], ['Akheituame', 'Lisa', 'lisa.akheituame@houstontx.gov', '4/30/2016', 'S'], ['Alexander', 'Bertha', 'bertha.alexander@missouricitytx.gov', '5/31/2022', 'S'], ['Alexander', 'Brian', 'bjalexander341@gmail.com', '3/31/2024', 'S'], ['Alexander', 'Gwen', 'ms2002ptcruiser@yahoo.com', '10/31/2007', 'S'], ['Alfred', 'Melinda', 'melinda.alfred@houstontx.gov', '3/31/2025', 'S'], ['Allen', 'Marcel', 'Marcel.Allen@houstontx.gov', '6/30/2024', 'S'], ['Allen', 'Nelva', 'ngamax@aol.com', '10/28/2007', 'S'], ['Allen', 'Troy', 'tallen@ghba.org', '1/31/2025', 'S'], ['Alpough', 'Chandra', 'chandra.alpough@portarthurtx.gov', '2/29/2024', 'S'], ['Amboree', 'Charlene', 'charlene.amboree@houstontx.gov', '4/30/2023', 'S'], ['Anderson', 'Emily', 'eanderson@halff.com', '7/31/2024', 'S'], ['Anderson', 'Goree', 'goree.anderson@hctx.net', '11/30/2007', 'S'], ['Anderson', 'Sonya', 'sonya.anderson1@houstontx.gov', '11/30/2018', 'S'], ['Antoine', 'Dwayne Pierre', 'D.Pierre-Antoine@gordian.com', '6/30/2022', 'S'], ['Antwine', 'Darrell', 'd.antwine0833@student.tsu.edu', '5/31/2022', 'S'], ['Aplon-Letson', 'Vanessa', 'vanessa.aplon@houstontx.gov', '11/30/2018', 'S'], ['Ardillo', 'Anthony', 'anthony.ardillo@siemens.com', '6/1/2022', 'S'], ['Armah', 'Niiobli', 'narmah@bloomberg.org', '4/30/2018', 'S'], ['Arnold', 'John', 'jarnold_349@hotmail.com', '10/31/2014', 'S'], ['Arya', 'Ruth', 'ruth.arya@houstontx.gov', '9/30/2021', 'S'], ['Asher', 'Darren', 'darren.asher@houstontx.gov', '7/31/2024', 'S'], ['Atkinson-Travis', 'Donna', 'donna.travis@houstontx.gov', '3/31/2015', 'S'], ['Atmore', 'Edena', 'acmcfo@palestine-tx.org', '4/30/2024', 'S'], ['Augillard', 'Paulishia', 'paulishia.augillard@houstontx.gov', '4/30/2016', 'S'], ['Babineaux', 'Joshua', 'joshua.babineaux@houstontx.gov', '7/31/2014', 'S'], ['Baker', 'Kendall', 'Kendall.baker@cityofhouston.net', '3/31/2009', 'S'], ['Barner', 'Melissia', 'melissia.barner@fortbendcountytx.gov', '4/30/2022', 'S'], ['Barnes', 'Ashley', 'Ashley.Barnes@ahf.org', '5/31/2025', 'S'], ['Barnes', 'Eboni', 'eboni_m_barnes@yahoo.com', '2/28/2014', 'S'], ['Barnes', 'Roy', 'Roy.Barnes@Houstontx.gov', '1/31/2018', 'S'], ['Bass', 'Everett', 'ebass2@wm.com', '11/15/2016', 'S'], ['Batiste', 'Dana', 'dbatiste@pwaterg.com', '1/31/2016', 'S'], ['Baxter', 'Erselette', 'erselette.baxter@houstontx.gov', '5/31/2014', 'S'], ['Bealer', 'Kaye', 'Kbealer@gmail.com', '6/30/2022', 'S'], ['Beaman', 'Terrence', 'TBeaman@bellairetx.gov', '8/31/2024', 'S'], ['Beatty', 'Johnny', 'jbeatty@ci.beaumont.tx.us', '10/31/2015', 'S'], ['Beaty', 'Reisha', 'reisha.beaty@houstontx.gov', '4/30/2017', 'S'], ['Bell', 'Cathelene', 'cathelene.bell@houstontx.gov', '1/31/2014', 'S'], ['Bell', 'James', 'JamesL.Bell@houstontx.gov', '5/31/2023', 'S'], ['Bennett', 'Rochelle', 'rochelle.bennett@houstontx.gov', '11/30/2016', 'S'], ['Bension', 'Stephanie', 'stephanie@positivepurposes.org', '4/30/2019', 'S'], ['Benson', 'Calvin', 'calvin.benson@houstontx.gov', '8/31/2024', 'S'], ['Bernard', 'Meggan', 'megganbernard@gmail.com', '5/31/2022', 'S'], ['Bethany', 'Joyce', 'joyce.bethany@msn.com', '1/31/2008', 'S'], ['Bledsoe', 'Patricia', 'patricia.bledsoe@houstontx.gov', '7/31/2015', 'S'], ['Boatman', 'Eligie', 'jboatman@sakcon.com', '11/30/2025', 'E'], ['Bolden', 'Marie', 'mariebolden1@yahoo.com', '5/31/2022', 'S'], ['Boney', 'Jeffrey', 'jeffrey.boney@missouricitytx.gov', '5/31/2022', 'S'], ['Bonier', 'Kirby', 'kirby.bonier@houstontx.gov', '5/31/2025', 'S'], ['Bonier', 'Yvonne', 'yvonne.bonier@cityofhouston.net', '10/31/2009', 'S'], ['Booker', 'JerMarkus', 'Booker_Jermarkus@yahoo.com', '9/30/2025', 'E'], ['Booker', 'Jordan', 'jdavonbooker@aol.com', '8/31/2023', 'S'], ['Bowie', 'Anthony', 'anthony.bowie@houstontx.gov', '8/31/2016', 'S'], ['Bradford', 'C.', 'brad3912@comcast.net', '8/31/2015', 'S'], ['Bradley', 'Nickea', 'nickea.bradley@houstontx.gov', '8/31/2014', 'S'], ['Brailey', 'Carla', 'braileycd@tsu.edu', '4/30/2019', 'S'], ['Braithwaite', 'Vanessa', 'VBraithwaite@Houstontx.gov', '5/31/2017', 'S'], ['Brewer', 'Shane', 'shane.brewer@tsu.edu', '5/31/2022', 'S'], ['Brinkley', 'Douglas', 'dbrinkley@sugarlandtx.gov', '2/28/2023', 'S'], ['Brown', 'Lacy', 'lacy.brown@houstontx.gov', '8/31/2024', 'S'], ['Bryant', 'Bragail', 'bragail.bryant@cityofhouston.net', '11/30/2017', 'S'], ['Bryant', 'William', 'william.bryant@houstontx.gov', '4/30/2020', 'S'], ['Burney', 'Zinetta', 'zburney@aol.com', '7/31/2009', 'S'], ['Butler', 'Christon', 'christon.butler@houstontx.gov', '6/30/2025', 'E'], ['Bynam', 'Keith', 'keith.bynam@houstontx.gov', '5/31/2022', 'S'], ['Bynum', 'Kenneth', 'kb@prosystemsus.com', '7/31/2023', 'S'], ['Byron', 'Lance', 'lancebyron3@gmail.com', '5/31/2022', 'S'], ['Caldwell', 'Carlos', 'c.caldwell3374@student.tsu.edu', '5/31/2022', 'S'], ['Caldwell', 'Kimberly', 'k.caldwell7118@student.tsu.edu', '5/31/2022', 'S'], ['Callis', 'LaTasha', 'latasha.hinckson@houstontx.gov', '3/31/2016', 'S'], ['Cannon', 'Tyler', 'tyleramandacannon@gmail.com', '5/31/2022', 'S'], ['Carrasco', 'Paula', 'paula.carrasco@houstontx.gov', '2/28/2022', 'S'], ['Carrier', 'Lee', 'lee.carrier@cfisd.net', '12/31/2020', 'S'], ['Carter', 'Deric', 'deric.carter@houstontx.gov', '8/31/2025', 'E'], ['Carter', 'Gregory', 'gec@hotmail.com', '6/30/2013', 'S'], ['Cave', 'Charles', 'buildonsuccess@gmail.com', '9/30/2012', 'S'], ['Celestine', 'Janine', 'jecelestine@sbcglobal.net', '11/30/2025', 'E'], ['Champagne', 'Lisa', 'lisachampagne1@gmail.com', '9/30/2021', 'S'], ['Chance', 'Beverly', 'beverly.chance@fortbendcountytx.gov', '4/30/2022', 'S'], ['Chandler', 'Grace', 'chandler_ge@hotmail.com', '3/31/2025', 'S'], ['Chargois', 'Yvette', 'yvette.chargois@noemail.com', '10/28/2007', 'S'], ['Charles', 'Clyde', 'Clyde.Charles@houstontx.gov', '9/30/2023', 'S'], ['Chase', 'Keith', 'keith.chase@siemens.com', '6/1/2022', 'S'], ['Chavis', 'Perdita', 'didichavis320@gmail.com', '10/31/2021', 'S'], ['Cheeks', 'Jane', 'jane.cheeks@houstontx.gov', '6/30/2024', 'S'], ['Christine', 'Amber', 'amberchristine1@yahoo.com', '6/30/2022', 'S'], ['Cleggett', 'Byron', 'byronm.cleggett@houstonpolice.org', '7/31/2020', 'S'], ['Cole', 'Sedrick', 'Cole2067@sbcglobal.net', '6/30/2022', 'S'], ['Coleman', 'Quonna', 'colemanqd@yahoo.com', '5/31/2010', 'S'], ['Collins', 'Nancy', 'nancy.collins@cityofhouston.net', '8/31/2008', 'S'], ['Conner', 'Rhonda', 'rhonda.conner@sbcglobal.net', '5/31/2008', 'S'], ['Cook', 'Charles', 'cookchar@co.fort-bend.tx.us', '10/31/2007', 'S'], ['Cooper', 'Miracle', 'mcooper@goodwillepierre.com', '8/31/2024', 'S'], ['Corpening', 'Jerry', 'jerry.corpening@houstontx.gov', '10/31/2022', 'S'], ['Council', 'Tony', 'tonycouncil@tlceng.com', '4/30/2019', 'S'], ['Dade', 'Sean', 'sean.dade@houstontx.gov', '2/29/2020', 'S'], ['Daisley', 'Sheldon', 'daislese@yahoo.com', '10/31/2023', 'S'], ['Dampier', 'Ronnie', 'Ronnie.dampier@hcfcd.hctx.net', '4/30/2022', 'S'], ['Darensbourg', 'Rayanne', 'rayanne_d@yahoo.com', '3/31/2014', 'S'], ['Davis', 'Aquanetta', 'aquanetta.davis@noemail.com', '2/28/2013', 'S'], ['Davis', 'Cakeita', 'cakeita.davis@houstontx.gov', '11/30/2022', 'S'], ['Davis', 'LaTasha', 'tashadee23@gmail.com', '5/31/2022', 'S'], ['Davis', 'Olivia', 'oliviadavis225@gmail.com', '5/31/2022', 'S'], ['Davis', 'Ruben', 'textex@sbcglobal.net', '7/31/2017', 'S'], ['Davis', 'Veronica O.', 'veronica.davis2@houstontx.gov', '3/31/2023', 'S'], ['Denton', 'Brandon', 'mrdenton07@gmail.com', '11/30/2023', 'S'], ['Derby', 'Tatalease', 'tatalease@gmail.com', '10/31/2014', 'S'], ['Diaz', 'Gina', 'gdiaz@gci-solutions.net', '5/25/2022', 'S'], ['Dobbins', 'Kierra', 'kierradelacey@gmail.com', '6/30/2025', 'E'], ['Dolby', 'Michael', 'dolbym@laportetx.gov', '9/30/2012', 'S'], ['Dominick', 'Kiara', 'kiaradominick@yahoo.com', '5/31/2022', 'S'], ['Donatto', 'James', 'james@thedonattogroup.com', '4/2/2021', 'S'], ['Dotson', 'Anissa', 'dotsondominates@gmail.com', '10/31/2021', 'S'], ['Dotson', 'Michael', 'michael.dotson@houstontx.gov', '10/31/2015', 'S'], ['Doughtie', 'Robyn', 'robyn.doughtie@fortbendcountytx.gov', '4/30/2022', 'S'], ['Dunn', 'Anthony', 'abdunnjr@mac.com', '7/31/2012', 'S'], ['Eaton', 'Samuel', 'samuel.eaton@jnegreenteam.com', '7/31/2020', 'S'], ['Edison', 'Gary', 'gary.edison@houstontx.gov', '7/31/2022', 'S'], ['Edwards', 'Anitriss', 'anitriss.edwards@houstontx.gov', '5/31/2019', 'S'], ['Edwards', 'Anitriss', 'aderde1@yahoo.com', '9/30/2023', 'S'], ['Edwards', 'Dorothy', 'dorothy.edwards2@cityofhouston.net', '10/31/2007', 'S'], ['Edwards', 'Egima', 'egima.edwards@missouricitytx.gov', '9/30/2022', 'S'], ['Elam', 'Paulia Young', 'paulia.elam@cityofhouston.net', '11/30/2007', 'S'], ['Ellison', 'David', 'dletxn@gmail.com', '8/22/2024', 'S'], ['Flanagan', 'Rick', 'rick.flanagan@houstontx.gov', '9/30/2013', 'S'], ['Flannory', 'Elijah', 'elijahmf1995@yahoo.com', '7/31/2018', 'S'], ['Flannory', 'Victoria', 'vflannory1999@gmail.com', '5/31/2022', 'S'], ['Flannory', 'Vincent', 'vincent.flannory@noemail.com', '8/31/2016', 'S'], ['Fleming-Gaines', 'Vanessalar', 'v.fleminggaines1364@student.tsu.edu', '5/31/2022', 'S'], ['Fletcher', 'Lajuria', 'lajuris.fletcher@houstontx.gov', '11/30/2013', 'S'], ['Fletcher', 'Sharon', 'sharon.fletcher@houstontx.gov', '12/31/2015', 'S'], ['Fletcher-Davies', 'Tracy', 'Tracy.fletcher-davies@houstontx.gov', '4/30/2022', 'S'], ['Flowers', 'Jonathan', 'texasexdf@aol.com', '7/31/2018', 'S'], ['Foley', 'Lonnie', 'lonnie.foley@houstontx.gov', '2/28/2018', 'S'], ['Ford', 'Cynthia', 'Cynthia.Ford@missouricitytx.gov', '9/30/2024', 'S'], ['Foreman-Hays', 'Faith', 'faith.foreman@houstontx.gov', '6/30/2023', 'S'], ['Frand', 'Chelsea', 'chelsea.frand@houstontx.gov', '8/31/2023', 'S'], ['Frank', 'Anita', 'Amccord.af@gmail.com', '5/31/2023', 'S'], ['Franklin', 'Chayla', 'chayla.franklin@houstontx.gov', '7/31/2023', 'S'], ['Frazier', 'Consuela', 'consuela.williams@houstontx.gov', '5/31/2015', 'S'], ['Freddie', 'Anthony Wayne', 'afreddie@swbell.net', '11/30/2012', 'S'], ['Freeman', 'Desirha', 'desirha.freeman@houstontx.gov', '8/31/2014', 'S'], ['Garcia', 'Katherine', 'katherinegarcia829@gmail.com', '7/31/2018', 'S'], ['Garner', 'Vickie', 'dunbyfaith@earthlink.net', '9/30/2017', 'S'], ['Garrett', 'Rodriquez', 'Rodriquez.Garrett@houstontx.gov', '12/31/2024', 'S'], ['Garrison', 'Lisa', 'lisa.garrison@houstontx.gov', '6/30/2024', 'S'], ['Gary', 'Cynthia', 'cgary@missouricitytx.gov', '8/31/2010', 'S'], ['Gatlin', 'Nicholas', 'nick_gatlin@yahoo.com', '7/31/2016', 'S'], ['Gayden', 'Balethia', 'balethia.gayden@cityofhouston.net', '2/28/2010', 'S'], ["Gibbs", "Martaz'Shia", 'mgibbs1@mail.usf.edu', '5/31/2022', 'S'], ["Gibbs", "Martaz'Shia", 'mgibbs@sugarlandtx.gov', '6/30/2024', 'S'], ['Gibson', 'Roberta', 'gibsonmr@tsu.edu', '6/30/2014', 'S'], ['Glass', 'Demarcus', 'demarcus.glass@houstontx.gov', '8/31/2016', 'S'], ['Gomez', 'Jennifer', 'jennifer.thomasgomez@missouricitytx.gov', '6/30/2022', 'S'], ['Gonzalez', 'Pamela', 'pgonz@jnegreenteam.com', '3/31/2019', 'S'], ['Gooding', 'Erle', 'eijj77@msn.com', '7/31/2010', 'S'], ['Gooding', 'Erle', 'esg281@gmail.com', '9/1/2021', 'S'], ['Graham', 'Robbins', 'Robbins.Graham@cox.net', '6/30/2022', 'S'], ['Green', 'Anita', 'anita.green@csd.hctx.net', '5/31/2023', 'S'], ['Green', 'Hilary', 'attyhhgreen@aol.com', '8/31/2009', 'S'], ['Green', 'Ornita', 'ogreen@ci.mocity.tx.us', '10/31/2009', 'S'], ['Green', 'Ronald', 'ronald.green@houstontx.gov', '2/29/2016', 'S'], ['Green', 'Ronald', 'rgreen@joneswalker.com', '6/30/2022', 'S'], ['Greeno', 'Frederick', 'frederick.greeno@houstontx.gov', '3/31/2023', 'S'], ['Gregory', 'Domonick', 'dagregory1906@gmail.com', '6/30/2017', 'S'], ['Grogan', 'Linda', 'linda.grogan@cityofhouston.net', '2/28/2018', 'S'], ['Guidry', 'Alice', 'alice.guidry@houstontx.gov', '3/31/2023', 'S'], ['Guillory', 'Gay Nell', 'GuilloryG@aetna.com', '6/30/2013', 'S'], ['Guillory', 'Steven', 'guillory@onmail.com', '1/31/2022', 'S'], ['Hall', 'Anthony', 'ahall@ahallaw.net', '11/30/2015', 'S'], ['Hall', 'Contina', 'contina.hall@houstontx.gov', '5/31/2016', 'S'], ['Hall', 'Deanna', 'halldea229@gmail.com', '11/30/2018', 'S'], ['Hall', 'Yolunda', 'yolundahall@gmail.com', '5/31/2022', 'S'], ['Haller', 'Arthur', 'abs@yahoo.com', '8/31/2007', 'S'], ['Hamilton', 'Destiny', 'destiny6299@yahoo.com', '7/31/2018', 'S'], ['Hamilton', 'Dimetra', 'dhamilton77@sbcglobal.net', '6/30/2010', 'S'], ['Hamilton', 'Shantel', 'shantel.hamilton@houstontx.gov', '10/31/2018', 'S'], ['Hardison', 'Tameka', 'tameka.hardison@houstontx.gov', '3/31/2024', 'S'], ['Hare-Everline', 'Nicole', 'Nicole.Hare-Everline@houstontx.gov', '4/30/2014', 'S'], ['Harris', 'Judy Hicks', 'judy.harris@houstontx.gov', '6/30/2025', 'E'], ['Harris', 'Paula', 'pharris1@slb.com', '9/30/2010', 'S'], ['Hassen', 'Larius', 'larius.hassen@houstontx.gov', '6/30/2019', 'S'], ['Hawley', 'Stephanie', 'shawley@austincc.edu', '9/30/2015', 'S'], ['Hayes', 'Lorenzo', 'lorenzodhayes.zo@gmail.com', '8/31/2017', 'S'], ['Haynes', 'Miles', 'Miles.Haynes@BeaumontTexas.gov', '3/31/2025', 'S'], ['Heard', 'Jazton', 'jaztonheard@yahoo.com', '5/31/2022', 'S'], ['Henderson', 'Daryl', 'daryl_henderson@sbcglobal.net', '5/31/2022', 'S'], ['Henderson', 'Kaylan', 'kaylan.henderson@houstontx.gov', '4/30/2024', 'S'], ['Henry', 'KaShona', 'Kashona.Henry@houstontx.gov', '11/30/2023', 'S'], ['Henry', 'Keith', 'keith.henry@tcag.state.tx.us', '2/28/2013', 'S'], ['Herbert', 'Bridget', 'bridgett.herbert@cityofhouston.net', '8/31/2008', 'S'], ['Hernandez', 'LaShanda', 'mshernandez151@gmail.com', '5/31/2022', 'S'], ['Herrington', 'Katie', 'katie.herrington@fortbendcountytx.gov', '2/28/2022', 'S'], ['Hilburn-Cade', 'Bonita', 'bcade001@gmail.com', '3/27/2025', 'S'], ['Hill', 'Beverly', 'bhill@mdta.state.md.us', '10/31/2012', 'S'], ['Hill', 'James', 'james.hill@houstontx.gov', '1/31/2017', 'S'], ['Hillsman', 'Nakia', 'nakia.hillsman@houstontx.gov', '2/28/2025', 'S'], ['Holder', 'Sheldon', 'sheldon.holder@houstontx.gov', '12/31/2016', 'S'], ['Holland', 'Nicole', 'nhollandnfbpa@gmail.com', '9/30/2019', 'S'], ['Holliday', 'Clarence', 'clarence.holliday@noemail.com', '7/12/2020', 'S'], ['Holliday', 'Jynell', 'jhollid2@yahoo.com', '7/12/2020', 'S'], ['Holloway', 'Adrienne', 'adrienne.holloway@csd.hctx.net', '4/30/2023', 'S'], ['Holmes', 'Tony', 'tony2holmes@gmail.com', '8/31/2014', 'S'], ['Hopkins', 'Trevoi', 'trevoihopkins@gmail.com', '5/31/2022', 'S'], ['Hornsby', 'Yokika', 'yokika@yahoo.com', '6/30/2016', 'S'], ['Howe', 'Lynette', 'lynette.howe@houstontx.gov', '12/31/2023', 'S'], ['Howse', 'Demetrius', 'kinghowse@gmail.com', '5/31/2022', 'S'], ['Hudson', 'Corrine', 'corrine.hudson@missouricitytx.gov', '5/31/2022', 'S'], ['Hunt', 'Vernon', 'hunt926@hotmail.com', '6/2/2022', 'S'], ['Hunter', 'Deidre', 'dhunter@sugarlandtx.gov', '6/30/2020', 'S'], ['Hussain', 'Rizwan', 'r.hussain3376@student.tsu.edu', '5/31/2022', 'S'], ['Igani', 'Iyalla Jr', 'iyallajnr@gmail.com', '7/31/2013', 'S'], ['Ikner', 'Michael', 'mikner@cstx.gov', '1/31/2010', 'S'], ['Irving', 'Blake', 'irving_blake@hotmail.com', '5/31/2023', 'S'], ['Ives', 'Kia', 'kia.ives@houstontx.gov', '7/11/2020', 'S'], ['Jackson', 'Jayvetta', 'jayvetta_jackson@yahoo.com', '5/31/2014', 'S'], ['Jackson', 'Sharon', 'sharon.jackson@houstontx.gov', '8/31/2018', 'S'], ['Jackson', 'Toni', 'tjackson@bankslawfirm.com', '3/31/2025', 'S'], ['James', 'Nabalee', 'Nabaleej@gmail.com', '11/30/2025', 'E'], ['Jarmon', 'Chris', 'cjarmon@cityofliberty.org', '1/31/2023', 'S'], ['Jasper', 'LaToya', 'latoya.jasper@missouricitytx.org', '12/31/2018', 'S'], ['John', 'Shiny', 'Shiny.john@houstontx.gov', '6/30/2022', 'S'], ['Johnson', 'Brian', 'bjohnson@datasors.com', '10/28/2007', 'S'], ['Johnson', 'Carla', 'carla.johnson@houstontx.gov', '7/31/2024', 'S'], ['Johnson', 'Deborah', 'deborah.johnson@houstontx.gov', '12/31/2017', 'S'], ['Johnson', 'Eartha', 'jean@legalwatch.com', '10/31/2012', 'S'], ['Johnson', 'George', 'george.johnson@cityofhouston.net', '11/30/2007', 'S'], ['Johnson', 'Mahogany', 'mahogany.johnson@houstontx.gov', '2/28/2017', 'S'], ['Johnson', 'Shavonda', 'shavonda.johnson@houstontx.gov', '4/30/2014', 'S'], ['Johnson', 'Stephanie', 'stephanie@simmonsjohnson.com', '11/8/2022', 'S'], ['Johnson', 'Suewan', 'sjohnson@velaw.com', '11/30/2007', 'S'], ['Johnson', 'Tellas', 'tellas.johnson@houstontx.gov', '8/31/2016', 'S'], ['Johnson', 'Tia', 'Tia.Johnson@houstontx.gov', '5/31/2025', 'S'], ['Jones', 'Connie', 'connie.jones@houstontx.gov', '5/31/2017', 'S'], ['Jones', 'Darrell', 'darrell.jones@cityofhouston.net', '12/31/2007', 'S'], ['Jones', 'Darryl', 'darryl.jones@noemail.com', '2/29/2008', 'S'], ['Jones', 'Dawn', 'dawnjones232@gmail.com', '5/31/2022', 'S'], ['Jones', 'Jolanda', 'jolanda.jones@cityofhouston.net', '3/31/2013', 'S'], ['Jones', 'Kaysha', 'kayshajones95@gmail.com', '5/31/2022', 'S'], ['Jones', 'Thomas', 'tjones@mjlm.com', '3/30/2015', 'S'], ['Jones RN', 'Risha', 'risha.jones@houstontx.gov', '4/30/2018', 'S'], ['Jordan', 'Brad', 'bjordan@positivepurposes.org', '3/31/2019', 'S'], ['Jordan', 'Tammara', 'drtamjordan@yahoo.com', '3/31/2025', 'S'], ['Joseph', 'Frankie', 'frankie.joseph@va.gov', '3/31/2010', 'S'], ['Kaiser', 'Jillan', 'jillan.kaiser@noemail.com', '5/31/2008', 'S'], ['Kalimkoottil', 'Neethu', 'neethu.kalimkoottil@missouricitytx.gov', '5/31/2022', 'S'], ['Knight-Marshall', 'Charlotte', 'ckm@tkgadvisors.net', '1/31/2017', 'S'], ['LaForge', 'Jennifer', 'jennifer.laforge@arc-is.com', '7/31/2016', 'S'], ['Lanaux', 'Brittney', 'brittneylanaux@gmail.com', '9/30/2018', 'S'], ['Langford', 'Meller', 'Meller.Langford@cityofhouston.net', '1/31/2011', 'S'], ['Langford', 'Pamela', 'pamela.langford@portarthurtx.gov', '10/31/2023', 'S'], ['Lavalais-Williams', 'Kaydra', 'kaydra.lavalais-williams@houstontx.gov', '12/31/2017', 'S'], ['Laws', 'Kalan', 'kalanlaws@gmail.com', '2/28/2013', 'S'], ['Laws', 'Velma', 'velma.laws@houstontx.gov', '12/31/2019', 'S'], ['Lawson', 'Rhea Brown', 'rhea.lawson@cityofhouston.net', '5/23/2013', 'S'], ['Lewis', 'Kendrack', 'kendrack_lewis@yahoo.com', '5/31/2010', 'S'], ['Lewis', 'Maurice', 'maurice.lewis@fortbendcountytx.gov', '2/28/2022', 'S'], ['Lewis', 'Toni', 'toni.lewis@houstontx.gov', '6/30/2022', 'S'], ['Lipscomb', 'Kai', 'kai.lipscomb.2021@gmail.com', '7/31/2018', 'S'], ['Lomax', 'Alex', 'alex@donattogroup.com', '1/31/2021', 'S'], ['Lytle', 'Courtney', 'JCourt00@aol.com', '4/30/2024', 'S'], ['Mangol', 'Kennedi', 'kennedi.m924@gmail.com', '1/31/2021', 'S'], ['Manning', 'Tanisha', 'tanisha@tanishamanning.com', '1/31/2025', 'S'], ['Mansaray', 'Rahmatu', 'rahmatu.mansaray@houstontx.gov', '11/30/2025', 'E'], ['Marchand', 'Greg', 'gregsr@avencion.com', '3/26/2023', 'S'], ['Marshall', 'Francesca', 'Francesca.Marshall@houstontx.gov', '11/30/2018', 'S'], ['Marshall', 'Kamau', 'kamau.m.marshall@gmail.com', '2/28/2013', 'S'], ['Marshall', 'Ricky', 'rickymarshall90@icloud.com', '5/31/2022', 'S'], ['Martin', 'Devonte', 'davonatemartin@gmail.com', '5/31/2022', 'S'], ['Martin', 'Shondel', 'shondel.martin@houstontx.gov', '2/29/2016', 'S'], ['Materre', 'Margaret', 'Margaret.Materre@fortbendcountytx.gov', '4/30/2022', 'S'], ['Mathews MBA', 'Cheryl', 'cheryl.mathews@houstontx.gov', '3/31/2015', 'S'], ['Maxey', 'Nathan', 'nathanmaxey@yahoo.com', '5/31/2010', 'S'], ['McBean', 'Clifford', 'cmcbean@missouricitytx.gov', '2/29/2020', 'S'], ['McCain', 'Jasmine', 'jasmine.mccain@missouricitytx.gov', '9/30/2024', 'S'], ['McCallan', 'Sade', 'sade.mccallan@missouricitytx.gov', '12/31/2021', 'S'], ['McClendon', 'Roderick', 'roderick.mcclendon@cityofhouston.net', '12/31/2007', 'S'], ['McClure-Simmons', 'Rakiya', 'rakiya23@outlook.com', '7/31/2018', 'S'], ['McDaniel', 'Jade', 'angelica150388@gmail.com', '7/26/2023', 'S'], ['McMillan', 'Kelli', 'mcmillan.kelli@gmail.com', '4/30/2024', 'S'], ['McNeese', 'Marlene', 'marlene.mcneese@houstontx.gov', '8/31/2023', 'S'], ['McNeese', 'Melanie', 'Melanie.McNeese@houstontx.gov', '6/30/2022', 'S'], ['McNeil', 'Mary', 'mary.mcneil@houstontx.gov', '4/30/2022', 'S'], ['Middleton EdD', 'Jennie', 'jymmiddl@swbell.net', '4/1/2015', 'S'], ['Miles', 'Richard', 'richard@legalwatch.com', '8/31/2010', 'S'], ['Miller', 'Tomeji', 'htmsi@comcast.net', '10/27/2023', 'S'], ['Mims', 'Chelbi', 'chelbi.mims@gmail.com', '2/28/2025', 'S'], ['Minnix', 'Scott', 'scott.minnix@houstontx.gov', '8/31/2015', 'S'], ['Mitchell', 'Nicole', 'mznicoleM29@gmail.com', '2/28/2013', 'S'], ['Mondesir', 'Pascale', 'pascale.mondesir@houstontx.gov', '9/30/2024', 'S'], ['Moore', 'Kristen', 'krismoore18@gmail.com', '2/28/2013', 'S'], ['Moore', 'Michael', 'mmoorenfbpa@gmail.com', '10/31/2020', 'S'], ['Moore', 'Thalia', 'renee.moore@houstontx.gov', '6/30/2021', 'S'], ['Moore', 'Willie', 'willie.moore@houstontx.gov', '3/31/2020', 'S'], ['Morris-Readore', 'Stephanie', 'stephanie.morris@houstontx.gov', '2/28/2025', 'S'], ['Morrow', 'Andre', 'andre.morrow@houstontx.gov', '12/31/2022', 'S'], ['Mose', 'Sherry', 'arowley@hmeps.org', '12/31/2018', 'S'], ['Murray', 'John', 'jyro07@yahoo.com', '5/31/2022', 'S'], ['Myers Evans', 'Angelique', 'angie.malone@gmail.com', '7/31/2020', 'S'], ['Ndaw', 'Alioun', 'alibadalioudaw@yahoo.com', '5/31/2011', 'S'], ['Ndibe', 'Patrick', 'Patrick.ndibe@houstontx.gov', '5/31/2023', 'S'], ['Nellons', 'Jasmine', 'jasminenellons@gmail.com', '1/28/2014', 'S'], ['Nellons-Paige', 'Stephanie', 'nellonspaigegroup@gmail.com', '11/30/2015', 'S'], ['Nelson', 'Hailey', 'hailey.nelson@noemail.com', '1/31/2015', 'S'], ['Nelson', 'Jordan', 'jordan_devon1313@yahoo.com', '10/31/2013', 'S'], ['Newman', 'Carl', 'carl.newman@houstontx.gov', '2/28/2015', 'S'], ['Niang PE', 'Aisha', 'aisha.niang@houstontx.gov', '8/10/2018', 'S'], ['Northern', 'David', 'dnorthern@housingforhouston.com', '3/31/2024', 'S'], ['Okolo', 'Monica', 'monicaokolo@aol.com', '5/31/2010', 'S'], ['Olickan Jr', 'Joe', 'jolickan@disastersllc.com', '4/30/2024', 'S'], ['Omwenyeke', 'Shadrack', 'shadrack.omwenyeke@houstontx.gov', '8/31/2024', 'S'], ['Onyebuchi', 'Ogadimna', 'ogadimna.onyebuchi@noemail.com', '8/31/2018', 'S'], ['Onygckwe', 'Patricia', 'onygckwe_p@yahoo.com', '5/31/2010', 'S'], ['Osinowo', 'Lydia', 'losinowo@gmail.com', '7/31/2023', 'S'], ['Outlaw', 'Curtis', 'coutlaw06@gmail.com', '7/31/2024', 'S'], ['Owens', 'DeShante', 'dowens@tlceng.com', '4/30/2019', 'S'], ['Owens', 'Nicole', 'Nicole.Owens@houstontx.gov', '6/30/2024', 'S'], ['Parker', 'Allen', 'allen.parker@cityofhouston.net', '10/31/2007', 'S'], ['Parker', 'Trinity', 'parker540145@yahoo.com', '1/31/2021', 'S'], ['Parnell', 'Jacqueline', 'jparnell@houstonisd.org', '3/31/2014', 'S'], ['Patton', 'Brenda', 'brenda.patton@fortbendcountytx.gov', '2/28/2022', 'S'], ['Peacock', 'Cuevas', 'c.peacock0684@student.tsu.edu', '10/31/2012', 'S'], ['Perkins', 'Danny', 'dperkins@escpolytech.com', '11/30/2014', 'S'], ['Perkins', 'Rodrick', 'iammrperkins@gmail.com', '5/31/2022', 'S'], ['Perkins', 'Tina', 'tina.perkins2@houstontx.gov', '6/30/2024', 'S'], ['Perry', 'Canania', 'kanani.perry@gmail.com', '2/28/2013', 'S'], ['Persaud', 'Renata', 'rpersaud7419@gmail.com', '11/30/2020', 'S'], ['Peterson II', 'Alan', 'acpete2@yahoo.com', '7/31/2014', 'S'], ['Phillips', 'Evelyn', 'evelyn.phillips@houstontx.gov', '6/30/2022', 'S'], ['Phipps', 'Lynn', 'lynn.phipps@houstontx.gov', '3/31/2018', 'S'], ['Pierce', 'Kerrie', 'kerrie.pierce@houstonpolice.org', '7/31/2020', 'S'], ['Pierre', 'Guilmate', 'guilmatep@gmail.com', '1/31/2022', 'S'], ['Pierre', 'James', 'goodwille@goodwillepierre.com', '8/31/2025', 'E'], ['Pinnock', 'Noel', 'noel.pinnock@Houstontx.gov', '6/30/2016', 'S'], ['Pitts', 'Arnita', 'Arnita.Pitts@houstontx.gov', '9/30/2022', 'S'], ['Pitts', 'Cynthia', 'cynthiapitts92@yahoo.com', '5/31/2010', 'S'], ['Pleasant', 'Shannon', 'shannon.pleasant@missouricitytx.gov', '2/28/2023', 'S'], ['Presley', 'Randy', 'randy.presley@houstontx.gov', '7/31/2022', 'S'], ['Prestage', 'Grady', 'grady.prestage@noemail.com', '2/28/2022', 'S'], ['Pruitt', 'Debra', 'debrapruitt0729@gmail.com', '11/30/2024', 'S'], ['Pruitt', 'Terry', 'pruitt48@yahoo.com', '5/31/2025', 'S'], ['Randall', 'Georgia', 'GeorgiaRan@yahoo.com', '2/29/2020', 'S'], ['Randle', 'Shauntalay', 'Shauntalayrandle@gmail.com', '6/30/2021', 'S'], ['Ransom', 'Tracy', 'tracy.ransom@houstontx.gov', '5/31/2025', 'S'], ['Rayford', 'Lisa', 'Lisa.rayford@aidshealth.org', '5/31/2025', 'S'], ['Reid', 'Omar', 'omar.reid@houstontx.gov', '3/31/2017', 'S'], ['Rene', 'Malcolm', 'mrene@hmefcu.org', '5/31/2020', 'S'], ['Reynolds', 'David', 'Drey88.dr@gmail.com', '4/30/2025', 'S'], ['Rich', 'Rose', 'Rose.rich58@yahoo.com', '6/30/2008', 'S'], ['Richard', 'Cindy', 'cindy.richard@houstontx.gov', '11/30/2018', 'S'], ['Richard', 'Navella', 'navella.richard@houstontx.gov', '4/30/2020', 'S'], ['Ricketts', 'LaToya', 'latoyarickettsnfbpa@gmail.com', '5/31/2023', 'S'], ['Riley', 'Herbert', 'herbkappa@aol.com', '11/30/2013', 'S'], ['Riley', 'Monica', 'MRJiConnections@gmail.com', '5/31/2022', 'S'], ['Robbins', 'David', 'David.Robbins@houstontx.gov', '6/30/2024', 'S'], ['Roberts', 'Flozelle', 'calandraroberts@gmail.com', '9/30/2023', 'S'], ['Robertson', 'Michael', 'michael.robertson@houstontx.gov', '3/31/2015', 'S'], ['Robinson', 'Aricia', 'aricia.robinson@houstontx.gov', '12/31/2018', 'S'], ['Robinson', 'Faye', 'faye.robinson@houstontx.gov', '8/31/2023', 'S'], ['Robinson', 'Siedah', 'siedah.t.robinson@gmail.com', '2/29/2020', 'S'], ['Robinson', 'Spurgeon', 'srobinson@mpact-consulting.com', '12/31/2024', 'S'], ['Rodriguez', 'Heidi', 'heidi.rodriguez@missouricitytx.gov', '9/30/2024', 'S'], ['Rodriguez', 'Sandra', 'sandra.rodriguez@houstontx.gov', '4/30/2022', 'S'], ['Rogers', 'Chris', 'Chrisrogersatx@gmail.com', '2/29/2024', 'S'], ['Russell', 'Martin', 'martin.russell@missouricitytx.gov', '5/31/2022', 'S'], ['Ruth', 'Roselynn', 'roselynn.ruth@houstontx.gov', '2/29/2024', 'S'], ['Salmon', 'Marquis', 'marquissalmon@gmail.com', '5/31/2022', 'S'], ['Sampson', 'Vanessa', 'vjsampson@aol.com', '4/30/2014', 'S'], ['Santa Cruz', 'Dwayne', 'cruzin4djs2001@yahoo.com', '6/9/2022', 'S'], ['Sawyers', 'William', 'sawyerw@nationwide.com', '4/30/2016', 'S'], ['Scallion', 'Alphonso', 'AScallion@vctx.org', '7/31/2017', 'S'], ['Scott', 'Brittany', 'brittanyl.scott85@gmail.com', '9/30/2012', 'S'], ['Scroggins', 'Jonathan', 'jonathanscroggins23@gmail.com', '1/31/2021', 'S'], ['Seals', 'Keisha', 'kseals@sugarlandtx.gov', '8/31/2024', 'S'], ['Session-Mathis', 'Cynthia', 'cynthia.session@houstontx.gov', '11/30/2011', 'S'], ['Shaw', 'Shaw', 'mnshaw@msn.com', '3/31/2022', 'S'], ['Shelton', 'Melissa', 'melissa.shelton@houstontx.gov', '10/31/2024', 'S'], ['Sheppard', 'Cheryl', 'Cheryl.sheppard@houstontx.gov', '6/30/2022', 'S'], ['Sims', 'Cohen', 'cohen.sims@houstontx.gov', '2/28/2018', 'S'], ['Sinclair', 'Brittney', 'bsinclair@sugarlandtx.gov', '1/31/2025', 'S'], ['Smith', 'Brandon', 'brandon.smith@cityofhouston.net', '2/28/2010', 'S'], ['Smith', 'Jessica', 'jessicacsmith12@yahoo.com', '2/28/2014', 'S'], ['Smith', 'Linda', 'ldsmith_1913@yahoo.com', '5/31/2010', 'S'], ['Smith', 'Marquis', 'marquis.smith@houstontx.gov', '3/31/2015', 'S'], ['Smith', 'Naomi', 'naomi.smith@houstontx.gov', '5/31/2019', 'S'], ['Smith', 'Rhonda', 'rhonda.smith@houstonpolice.org', '12/31/2024', 'S'], ['Smith', 'Shea', 'sheajordansmith@gmail.com', '5/31/2022', 'S'], ['Smith', 'Wendell', 'wendell.smith@houstontx.gov', '8/31/2023', 'S'], ['Snipes', 'Anthony', 'snipes2801@gmail.com', '5/31/2025', 'S'], ['Solomon', 'Mickey', 'mickey.solomon@houstontx.gov', '7/31/2012', 'S'], ['Soto', 'Maggie', 'magdalena.soto@houstontx.gov', '8/31/2024', 'S'], ['Sowells', 'Camille', 'csowells@cpyi.com', '11/30/2018', 'S'], ['Spriggs', 'Kenisha', 'kenisha.spriggs@houstontx.gov', '8/31/2023', 'S'], ['Spriggs', 'Otis', 'otisspriggs@gmail.com', '12/31/2018', 'S'], ['Sriram', 'Kavitha', 'kavitha.sriram@houstontx.gov', '3/31/2023', 'S'], ['Staten', 'Latreka', 'latreka.staten@houstontx.gov', '4/30/2022', 'S'], ['Stewart', 'Donteak', 'donteak.stewart@houstontx.gov', '8/31/2023', 'S'], ['Stottlemyer', 'Cory', 'cstottlemyer@missouricitytx.gov', '12/31/2018', 'S'], ['Subias', 'Carla', 'carla.subias@houstontx.gov', '4/30/2023', 'S'], ['Sullivan', 'Brandi', 'brandi.sullivan@cityofhouston.net', '11/30/2010', 'S'], ['Tates', 'MyTesha', 'mytesha.tates@cityofhouston.net', '9/30/2008', 'S'], ['Taylor', 'Kenneth', 'kataylor@tamu.edu', '2/28/2025', 'S'], ['Taylor', 'Landon', 'tsuaxman@aol.com', '5/31/2010', 'S'], ['Taylor-Jay', 'Etta', 'etta.taylorjay@missourcitytx.gov', '5/31/2022', 'S'], ['Tennyson', 'Jeffrey', 'Jeffrey.Tennyson@houstontx.gov', '6/30/2024', 'S'], ['Terry', 'Carolyn', 'carolyn.terry@houstontx.gov', '7/31/2024', 'S'], ['Thibodeaux', 'Matt', 'mattt@houstonmidtown.com', '11/30/2018', 'S'], ['Thomas', 'Jack', 'jtjr1949@gmail.com', '3/31/2023', 'S'], ['Thomas', 'Nicole', 'nicolethomas02@msn.com', '5/31/2010', 'S'], ['Thomas', 'Talya', 'talyat01@aol.com', '3/3/2015', 'S'], ['Thomas', 'Tanea', 'taneathomas11@gmail.com', '1/31/2021', 'S'], ['Thompson', 'DonMonique', 'donmonique.thompson@houstontx.gov', '6/30/2024', 'S'], ['Thompson Dr', 'Alice', 'athomp2206@icloud.com', '5/31/2022', 'S'], ['Thurmond', 'James', 'jhthurmo@central.uh.edu', '9/30/2021', 'S'], ['Tillotson', 'Gwendolyn', 'Gwendolyn.tillotson@cityofhouston.net', '7/31/2011', 'S'], ['Tims', 'Randy', 'randy.tims2@houstontx.gov', '8/31/2016', 'S'], ['Tomberlin', 'Jeffrey', 'tomberlinjeff@gmail.com', '5/31/2022', 'S'], ['Trotter', 'Jason', 'jason.trotter@houstontx.gov', '5/31/2025', 'S'], ['Tucker', 'Geraldine', 'gtucker@austincc.edu', '9/30/2015', 'S'], ['Tuckerson', 'Tracy', 'tracy.tuckerson@houstontx.gov', '5/31/2016', 'S'], ['Tyler', 'Crystal', 'crystal.tyler@noemail.com', '7/11/2020', 'S'], ['Ugbala', 'Nkemjika', 'kemiugbala@gmail.com', '9/30/2012', 'S'], ['Vann', 'Brittney', 'bnvann@gmail.com', '5/31/2013', 'S'], ['Vaughn', 'Michael', 'michael.vaughn@houstontx.gov', '8/31/2016', 'S'], ['Vincent', 'Shenette', 'shenette.seals@houstontx.gov', '3/31/2023', 'S'], ['Vincent', 'Shenette', 'shenette.vincent@houstontx.gov', '5/31/2025', 'S'], ['Walker', 'Lenoria', 'walker.lenoria@gmail.com', '1/22/2016', 'S'], ['Walker', 'Modeane', 'modeane.walker@houstontx.gov', '1/31/2015', 'S'], ['Walker', 'Stacie', 'swalker@missouricitytx.gov', '12/31/2020', 'S'], ['Walter', 'Alice', 'awalter19@sbcglobal.net', '9/30/2009', 'S'], ['Ward', 'Darrin', 'darrin.ward@cityofhouston.net', '8/31/2010', 'S'], ['Washington', 'Angela', 'angela.washington@houstontx.gov', '2/28/2019', 'S'], ['Washington', 'Eric', 'eric.washington@aggienetwork.com', '5/31/2022', 'S'], ['Washington', 'Senarian', 'senarian16@icloud.com', '5/31/2022', 'S'], ['Watson', 'Latricia', 'lswatson@wileyc.edu', '5/31/2022', 'S'], ['Watts', 'Ashley', 'a.watts4567@student.tsu.edu', '5/31/2022', 'S'], ['White', 'Danielle', 'daniellejosephwhite@cityofhouston.net', '7/31/2010', 'S'], ['White', 'Tonia', 'tonia.white@houstontx.gov', '4/30/2022', 'S'], ['Willett', 'Mosis', 'Mosos.willett@cityofhouston.net', '11/15/2007', 'S'], ['Williams', 'Blayne', 'blainew20@aol.com', '5/31/2022', 'S'], ['Williams', 'Clifton', 'clifton.williams@portarthurtx.gov', '6/30/2022', 'S'], ['Williams', 'Edward', 'ewilliams@missouricitytx.gov', '1/31/2020', 'S'], ['Williams', 'Evelyn', 'evelyn.williams@houstontx.gov', '2/28/2015', 'S'], ['Williams', 'Jeffrey', 'jeffrey.williams@houstontx.gov', '9/30/2017', 'S'], ['Williams', 'Marilyn', 'marilyn.bankston@sbcglobal.net', '4/30/2014', 'S'], ['Williams', 'Marilyn', 'marilynbankston@sbcglobal.net', '6/30/2022', 'S'], ['Williams', 'Omar', 'owilliams@tcaptx.com', '7/31/2024', 'S'], ['Williams', 'Tanya', 'tanya.williams@houstontx.gov', '8/31/2018', 'S'], ['Williams', 'Troy', 'troy.williams@houstontx.gov', '6/30/2015', 'S'], ['Williamson', 'Donya', 'donyawilliamson22@gmail.com', '2/29/2024', 'S'], ['Wilson', 'Darryl', 'dwilson@dconcierge.net', '4/30/2013', 'S'], ['Wilson', 'Rochette', 'rochette_wilson@hotmail.com', '5/31/2022', 'S'], ['Wilson', 'Tucker', 'tucker.wilson@houstontx.gov', '9/30/2025', 'E'], ['Wilson', 'Yolanda', 'yolanda.wilson@cityofhouston.net', '2/28/2010', 'S'], ['Wilson MBA CPM', 'Verdis', 'verdis.wilson@houstontx.gov', '6/30/2025', 'E'], ['Woods', 'Janice', 'janice.woods@houstontx.gov', '2/28/2014', 'S'], ['Woods', 'R. Correy', 'robert.woods@houstontx.gov', '12/31/2015', 'S'], ['Woods', 'Unice', 'unice.lee@aol.com', '5/31/2022', 'S'], ['Wright', 'Amber', 'amber.wright2@houstontx.gov', '5/31/2022', 'S'], ['Wright', 'Carlecia', 'carlecia.wright@houstontx.gov', '8/31/2020', 'S'], ['Wright', 'Carolyn', 'carolyn.wright@houstontx.gov', '1/31/2021', 'S'], ['Wright', 'Philip', 'pwright@housingforhouston.com', '3/31/2019', 'S'], ['Wright', 'Philip', 'philip.wrightjd@gmail.com', '8/31/2021', 'S'], ['Wyre', 'Tangela', 'tangewyre@gmail.com', '8/31/2024', 'S'], ['Zilton', 'Edward', 'edward.zilton@houstontx.gov', '8/31/2016', 'S']];

const CURRENT_MEMBERS = [
  {"id": 1, "name": "Mr. Rodrego Byerly", "first": "Rodrego", "last": "Byerly", "org": "", "title": "CEO", "memberType": "Corporate Member (up to 250 employees)", "status": "Unknown", "since": "5/6/2025", "expiration": "", "email": "byerly@evitarus.com", "phone": "(424) 235-8455", "sourceTab": "Cherrelle"},
  {"id": 2, "name": "Ms. Arielle Castle", "first": "Arielle", "last": "Castle", "org": "", "title": "Planner", "memberType": "Individual Member", "status": "Unknown", "since": "5/1/2025", "expiration": "", "email": "arielle.castle@pct2.hctx.net", "phone": "(614) 531-6672", "sourceTab": "Cherrelle"},
  {"id": 3, "name": "Krystal Renee Winkley", "first": "Krystal", "last": "Winkley", "org": "", "title": "Project Coordinator", "memberType": "Individual Member", "status": "Unknown", "since": "2/6/2025", "expiration": "", "email": "krystal.winkley@houstontx.gov", "phone": "(832) 393-4355", "sourceTab": "Cherrelle"},
  {"id": 4, "name": "Dr. Ericka Brown M.D.", "first": "Ericka", "last": "Brown", "org": "", "title": "Local Health Authority/Division Director", "memberType": "Individual Member", "status": "Unknown", "since": "11/15/2024", "expiration": "", "email": "ericka.brown@phs.hctx.net", "phone": "", "sourceTab": "Cherrelle"},
  {"id": 5, "name": "Nabalee James", "first": "Nabalee", "last": "James", "org": "", "title": "Compliance Manager", "memberType": "Individual Member", "status": "Unknown", "since": "11/8/2024", "expiration": "", "email": "nabaleej@gmail.com", "phone": "(239) 771-0971", "sourceTab": "Cherrelle"},
  {"id": 6, "name": "Mr. JerMarkus L Booker", "first": "JerMarkus", "last": "Booker", "org": "", "title": "Senior Corporate Partnership Manager", "memberType": "Individual Member", "status": "Unknown", "since": "9/4/2024", "expiration": "", "email": "booker_jermarkus@yahoo.com", "phone": "(301) 717-9617", "sourceTab": "Cherrelle"},
  {"id": 7, "name": "Mr. Kirby Bonier", "first": "Kirby", "last": "Bonier", "org": "", "title": "Administration Manager", "memberType": "Individual Member", "status": "Unknown", "since": "4/14/2007", "expiration": "", "email": "kirby.bonier@houstontx.gov", "phone": "", "sourceTab": "Cherrelle"},
  {"id": 8, "name": "James Doyle", "first": "James", "last": "Doyle", "org": "", "title": "Assistant Director of Tranportation & Natural Resources", "memberType": "Individual Member", "status": "Unknown", "since": "3/31/2015", "expiration": "", "email": "jay.doyle@traviscountytx.gov", "phone": "(832) 716-0630", "sourceTab": "Cherrelle"},
  {"id": 9, "name": "Mr. Eddie Washington EMPA", "first": "Eddie", "last": "Washington", "org": "", "title": "Contract Manager", "memberType": "Individual Member", "status": "Unknown", "since": "3/1/2006", "expiration": "", "email": "eddie.washington@austinenergy.com", "phone": "", "sourceTab": "Cherrelle"},
  {"id": 10, "name": "Mr. Eligie Jack Boatman Business Development", "first": "Eligie", "last": "Boatman", "org": "", "title": "Corporate Member (up to 250 employees)", "memberType": "Individual Member", "status": "Unknown", "since": "11/30/2025", "expiration": "", "email": "jboatman@sakcon.com", "phone": "", "sourceTab": "Cherrelle"},
  {"id": 11, "name": "Mr. Ted Sims", "first": "Ted", "last": "Sims", "org": "TSG Industries", "title": "", "memberType": "Individual Member", "status": "Unknown", "since": "9/9/2009", "expiration": "6/30/2026", "email": "", "phone": "", "sourceTab": "Dr. Ericka Brown"},
  {"id": 12, "name": "Ms. Jeana L. Nellons", "first": "Jeana", "last": "Nellons", "org": "Jeana Enterprises", "title": "", "memberType": "Retiree Member", "status": "Unknown", "since": "10/1/2002", "expiration": "2/28/2026", "email": "", "phone": "", "sourceTab": "Dr. Ericka Brown"},
  {"id": 13, "name": "Mr. Eric Keith Dargan", "first": "Eric", "last": "Dargan", "org": "Eric Dargan", "title": "", "memberType": "Retiree Member", "status": "Unknown", "since": "9/1/2002", "expiration": "2/28/2026", "email": "", "phone": "", "sourceTab": "Dr. Ericka Brown"},
  {"id": 14, "name": "Ms. Bonita J. Hilburn-Cade", "first": "Bonita", "last": "Hilburn-Cade", "org": "Bonita Hilburn-Cade", "title": "", "memberType": "Retiree Member", "status": "Unknown", "since": "10/1/1994", "expiration": "3/27/2025", "email": "", "phone": "", "sourceTab": "Dr. Ericka Brown"},
  {"id": 15, "name": "Mr. Stephen L. Williams, MED, MPA", "first": "Stephen", "last": "Williams, MED, MPA", "org": "Houston Health Department", "title": "", "memberType": "Individual Member", "status": "Unknown", "since": "1/1/1989", "expiration": "5/31/2025", "email": "", "phone": "", "sourceTab": "Dr. Ericka Brown"},
  {"id": 16, "name": "Ms. Valerie L. Rivers", "first": "Valerie", "last": "Rivers", "org": "Houston Health Department", "title": "", "memberType": "Individual Member", "status": "Unknown", "since": "4/1/1983", "expiration": "8/31/2025", "email": "", "phone": "", "sourceTab": "Dr. Ericka Brown"},
  {"id": 17, "name": "NAKIA S HILLSMAN", "first": "NAKIA", "last": "HILLSMAN", "org": "CITY OF HOUSTON", "title": "", "memberType": "Individual Member", "status": "Unknown", "since": "Individual Member", "expiration": "10/24/2017", "email": "", "phone": "", "sourceTab": "Dr. Ericka Brown"},
  {"id": 18, "name": "David Reynolds", "first": "David", "last": "Reynolds", "org": "Harris County Public Health", "title": "Senior Manager", "memberType": "Individual Member", "status": "Unknown", "since": "4/13/2024", "expiration": "4/30/2025", "email": "drey88.dr@gmail.com", "phone": "", "sourceTab": "Gethorio"},
  {"id": 19, "name": "Sydney Janae Snipes", "first": "Sydney", "last": "Snipes", "org": "Wings Track Club", "title": "Student", "memberType": "Student Member", "status": "Unknown", "since": "3/15/2024", "expiration": "3/31/2026", "email": "sydney.snipes@yahoo.com", "phone": "", "sourceTab": "Gethorio"},
  {"id": 20, "name": "Grace Elizabeth Chandler", "first": "Grace", "last": "Chandler", "org": "Grace Chandler", "title": "Communication", "memberType": "Individual Member", "status": "Unknown", "since": "3/14/2024", "expiration": "3/31/2025", "email": "chandler_ge@hotmail.com", "phone": "", "sourceTab": "Gethorio"},
  {"id": 21, "name": "Toni Jackson", "first": "Toni", "last": "Jackson", "org": "The Banks Law Firm, P.A.", "title": "Principal", "memberType": "Individual Member", "status": "Unknown", "since": "3/6/2024", "expiration": "3/31/2025", "email": "tjackson@bankslawfirm.com", "phone": "", "sourceTab": "Gethorio"},
  {"id": 22, "name": "Tammara Jordan", "first": "Tammara", "last": "Jordan", "org": "Houston Health Department", "title": "Administration Manager", "memberType": "Individual Member", "status": "Unknown", "since": "3/6/2024", "expiration": "3/31/2025", "email": "drtamjordan@yahoo.com", "phone": "", "sourceTab": "Gethorio"},
  {"id": 23, "name": "Kenneth A Taylor", "first": "Kenneth", "last": "Taylor", "org": "Kenneth Taylor", "title": "Dr.", "memberType": "Individual Member", "status": "Unknown", "since": "2/20/2024", "expiration": "2/28/2025", "email": "kataylor@tamu.edu", "phone": "", "sourceTab": "Gethorio"},
  {"id": 24, "name": "Chelbi Mims", "first": "Chelbi", "last": "Mims", "org": "Texas Public Charter Schools Association", "title": "Senior Director of Regional Advocacy", "memberType": "Individual Member", "status": "Unknown", "since": "2/15/2024", "expiration": "2/28/2025", "email": "chelbi.mims@gmail.com", "phone": "713-822-0666", "sourceTab": "Gethorio"},
  {"id": 25, "name": "Ms. Melinda Alfred", "first": "Melinda", "last": "Alfred", "org": "City of Houston", "title": "System Support Analyst II", "memberType": "Individual Member", "status": "Unknown", "since": "12/17/2012", "expiration": "3/31/2025", "email": "melinda.alfred@houstontx.gov", "phone": "832-586-9446", "sourceTab": "Gethorio"},
  {"id": 26, "name": "Brittany J McKinney", "first": "Brittany", "last": "McKinney", "org": "", "title": "Executive Assistant", "memberType": "Individual Member", "status": "Unknown", "since": "1/29/2024", "expiration": "", "email": "bmckinney@sugarlandtx.gov", "phone": "281-275-2080", "sourceTab": "Danita Collins"},
  {"id": 27, "name": "Rachel Gutierrez", "first": "Rachel", "last": "Gutierrez", "org": "", "title": "Program Coordinator", "memberType": "Individual Member", "status": "Unknown", "since": "1/8/2024", "expiration": "", "email": "rachgutierrez13@gmail.com", "phone": "281-381-4748", "sourceTab": "Danita Collins"},
  {"id": 28, "name": "Rev. Edward Burkley Perry", "first": "Edward", "last": "Perry", "org": "", "title": "Student", "memberType": "Student Member", "status": "Unknown", "since": "12/21/2023", "expiration": "", "email": "ebperry68@gmail.com", "phone": "(718) 607-4104", "sourceTab": "Danita Collins"},
  {"id": 29, "name": "LaNiece Blue", "first": "LaNiece", "last": "Blue", "org": "", "title": "Division Manager", "memberType": "Individual Member", "status": "Unknown", "since": "11/30/2023", "expiration": "", "email": "laniece.blue@houstontx.gov", "phone": "", "sourceTab": "Danita Collins"},
  {"id": 30, "name": "Rahmatu Mansaray", "first": "Rahmatu", "last": "Mansaray", "org": "", "title": "Deputy Assistant Director/Director of Nursing", "memberType": "Individual Member", "status": "Unknown", "since": "11/30/2023", "expiration": "", "email": "rahmatu.mansaray@houstontx.gov", "phone": "", "sourceTab": "Danita Collins"},
  {"id": 31, "name": "Mathew R White", "first": "Mathew", "last": "White", "org": "", "title": "Financial Consultant", "memberType": "Individual Member", "status": "Unknown", "since": "6/16/2023", "expiration": "", "email": "mwhite@pacesetterco.com", "phone": "713-899-4595", "sourceTab": "Danita Collins"},
  {"id": 32, "name": "Kierra Dobbins", "first": "Kierra", "last": "Dobbins", "org": "", "title": "", "memberType": "Individual Member", "status": "Unknown", "since": "6/13/2023", "expiration": "", "email": "kierradelacey@gmail.com", "phone": "214-907-4312", "sourceTab": "Danita Collins"},
  {"id": 33, "name": "Shenette Marie Vincent", "first": "Shenette", "last": "Vincent", "org": "", "title": "Administrative Coordinator", "memberType": "Individual Member", "status": "Unknown", "since": "5/30/2023", "expiration": "", "email": "shenette.vincent@houstontx.gov", "phone": "713-898-7684", "sourceTab": "Kimberly"},
  {"id": 34, "name": "Almika Millage", "first": "Almika", "last": "Millage", "org": "", "title": "", "memberType": "Individual Member", "status": "Unknown", "since": "5/4/2023", "expiration": "", "email": "almika.millage@houstontx.gov", "phone": "281-782-0788", "sourceTab": "Kimberly"},
  {"id": 35, "name": "Tucker Wilson", "first": "Tucker", "last": "Wilson", "org": "", "title": "Deputy Assistant Director", "memberType": "Individual Member", "status": "Unknown", "since": "3/29/2023", "expiration": "", "email": "tucker.wilson@houstontx.gov", "phone": "346-802-7508", "sourceTab": "Kimberly"},
  {"id": 36, "name": "Terry Isaiah Pruitt", "first": "Terry", "last": "Pruitt", "org": "", "title": "Recovery Project Manager", "memberType": "Individual Member", "status": "Unknown", "since": "2/23/2023", "expiration": "", "email": "pruitt48@yahoo.com", "phone": "281-543-4507", "sourceTab": "Kimberly"},
  {"id": 37, "name": "Miles Haynes", "first": "Miles", "last": "Haynes", "org": "", "title": "Assistant to the City Manager, Special Projects", "memberType": "Individual Member", "status": "Unknown", "since": "2/20/2023", "expiration": "", "email": "miles.haynes@beaumonttexas.gov", "phone": "832-763-0440", "sourceTab": "Kimberly"},
  {"id": 38, "name": "Angel Jones", "first": "Angel", "last": "Jones", "org": "", "title": "City Manager", "memberType": "Individual Member", "status": "Unknown", "since": "2/10/2023", "expiration": "", "email": "angel.jones@missouricitytx.gov", "phone": "", "sourceTab": "Kimberly"},
  {"id": 39, "name": "Anthony O\u2019Neil Davis", "first": "Anthony", "last": "Davis", "org": "", "title": "Sr Staff Analyst", "memberType": "Individual Member", "status": "Unknown", "since": "11/1/2022", "expiration": "", "email": "anthony.davis2@houstontx.gov", "phone": "917-723-9970", "sourceTab": "Kimberly"},
  {"id": 40, "name": "Deric Carter", "first": "Deric", "last": "Carter", "org": "", "title": "Senior Staff Analyst", "memberType": "Individual Member", "status": "Unknown", "since": "9/8/2022", "expiration": "", "email": "deric.carter@houstontx.gov", "phone": "281-744-2361", "sourceTab": "Deja Evans"},
  {"id": 41, "name": "Tracy M Ransom", "first": "Tracy", "last": "Ransom", "org": "", "title": "Administrative Coordinator", "memberType": "Individual Member", "status": "Unknown", "since": "8/25/2022", "expiration": "", "email": "tracy.ransom@houstontx.gov", "phone": "", "sourceTab": "Deja Evans"},
  {"id": 42, "name": "Shayla Lee", "first": "Shayla", "last": "Lee", "org": "", "title": "Assistant to the City Manager", "memberType": "Individual Member", "status": "Unknown", "since": "6/30/2022", "expiration": "", "email": "slee@sugarlandtx.gov", "phone": "", "sourceTab": "Deja Evans"},
  {"id": 43, "name": "Kenneth Smith", "first": "Kenneth", "last": "Smith", "org": "", "title": "Director", "memberType": "Individual Member", "status": "Unknown", "since": "6/7/2022", "expiration": "", "email": "kenny.smith@beaumonttexas.gov", "phone": "", "sourceTab": "Deja Evans"},
  {"id": 44, "name": "Christon Butler", "first": "Christon", "last": "Butler", "org": "", "title": "Deputy Chief Operating Officer", "memberType": "Individual Member", "status": "Unknown", "since": "3/17/2022", "expiration": "", "email": "christon.butler@houstontx.gov", "phone": "281-831-2992", "sourceTab": "Deja Evans"},
  {"id": 45, "name": "Harry J Hayes", "first": "Harry", "last": "Hayes", "org": "", "title": "Retired Chief Operating Officer,  Retired Director of Solid Waste Management", "memberType": "Retiree Member", "status": "Unknown", "since": "12/9/2021", "expiration": "", "email": "hjfade1964@att.net", "phone": "(832) 229-3100", "sourceTab": "Deja Evans"},
  {"id": 46, "name": "Mr. George Davis", "first": "George", "last": "Davis", "org": "", "title": "Director of Pleasure Island", "memberType": "Individual Member", "status": "Unknown", "since": "9/30/2021", "expiration": "", "email": "george.davis@portarthurtx.gov", "phone": "", "sourceTab": "Deja Evans"},
  {"id": 47, "name": "Tia N Johnson", "first": "Tia", "last": "Johnson", "org": "", "title": "", "memberType": "Individual Member", "status": "Unknown", "since": "4/23/2021", "expiration": "", "email": "tia.johnson@houstontx.gov", "phone": "815-272-4898", "sourceTab": "Rachel Gutierrez"},
  {"id": 48, "name": "Mrs. Janine Evonne Celestine", "first": "Janine", "last": "Celestine", "org": "", "title": "", "memberType": "Individual Member", "status": "Unknown", "since": "2/28/2020", "expiration": "", "email": "jecelestine@sbcglobal.net", "phone": "832-860-4770", "sourceTab": "Rachel Gutierrez"},
  {"id": 49, "name": "Stephanie Morris- Readore", "first": "Stephanie", "last": "Morris- Readore", "org": "", "title": "Staff Analyst", "memberType": "Individual Member", "status": "Unknown", "since": "8/16/2019", "expiration": "", "email": "stephanie.morris@houstontx.gov", "phone": "832-439-0280", "sourceTab": "Rachel Gutierrez"},
  {"id": 50, "name": "Mr. John E Saunders III", "first": "John", "last": "Saunders", "org": "", "title": "Managing Director", "memberType": "Retiree Member", "status": "Unknown", "since": "5/22/2019", "expiration": "", "email": "jesaundersiii@gmail.com", "phone": "(202) 262-1466", "sourceTab": "Rachel Gutierrez"},
  {"id": 51, "name": "Allena Portis", "first": "Allena", "last": "Portis", "org": "", "title": "Assistant City Manager", "memberType": "Individual Member", "status": "Unknown", "since": "5/2/2018", "expiration": "", "email": "allena.portis@missouricitytx.gov", "phone": "916-475-8863", "sourceTab": "Rachel Gutierrez"},
  {"id": 52, "name": "Simone Wilson", "first": "Simone", "last": "Wilson", "org": "", "title": "Marketing Manager", "memberType": "Individual Member", "status": "Unknown", "since": "6/8/2017", "expiration": "", "email": "wilsonsimonem@gmail.com", "phone": "281-813-9498", "sourceTab": "Rachel Gutierrez"},
  {"id": 53, "name": "Ms. Shameka M Marshall", "first": "Shameka", "last": "Marshall", "org": "", "title": "Analyst", "memberType": "Individual Member", "status": "Unknown", "since": "4/1/2015", "expiration": "", "email": "shameka.marshall@houstontx.gov", "phone": "832-248-2668", "sourceTab": "Rachel Gutierrez"},
  {"id": 54, "name": "Mr. Christopher Everett Sparks", "first": "Christopher", "last": "Sparks", "org": "", "title": "Chief Sanitarian", "memberType": "Individual Member", "status": "Unknown", "since": "6/21/2021", "expiration": "", "email": "cesparks01@aol.com", "phone": "216-632-3702", "sourceTab": "Danny"},
  {"id": 55, "name": "Lynn Clouser", "first": "Lynn", "last": "Clouser", "org": "", "title": "Councilmember", "memberType": "Individual Member", "status": "Unknown", "since": "6/1/2021", "expiration": "", "email": "lynn.clouser@missouricitytx.gov", "phone": "832-594-1434", "sourceTab": "Danny"},
  {"id": 56, "name": "Jason Trotter", "first": "Jason", "last": "Trotter", "org": "", "title": "Environmental Investigator", "memberType": "Individual Member", "status": "Unknown", "since": "6/1/2021", "expiration": "", "email": "jason.trotter@houstontx.gov", "phone": "", "sourceTab": "Danny"},
  {"id": 57, "name": "Ashley Barnes", "first": "Ashley", "last": "Barnes", "org": "", "title": "Program Manager of Public Health Public Health Division", "memberType": "Corporate Member (over 500 employees)", "status": "Unknown", "since": "5/4/2021", "expiration": "", "email": "ashley.barnes@ahf.org", "phone": "", "sourceTab": "Danny"},
  {"id": 58, "name": "Lisa Rayford", "first": "Lisa", "last": "Rayford", "org": "", "title": "Linkage Specialist", "memberType": "Corporate Member (over 500 employees)", "status": "Unknown", "since": "5/4/2021", "expiration": "", "email": "lisa.rayford@aidshealth.org", "phone": "", "sourceTab": "Danny"},
  {"id": 59, "name": "Mr. Anthony J. Snipes", "first": "Anthony", "last": "Snipes", "org": "", "title": "Regional Director - Texas", "memberType": "Corporate Member (over 500 employees)", "status": "Unknown", "since": "5/4/2021", "expiration": "", "email": "snipes2801@gmail.com", "phone": "817-905-7641", "sourceTab": "Danny"},
  {"id": 60, "name": "Gwendolyn F. Climmons", "first": "Gwendolyn", "last": "Climmons", "org": "", "title": "Special Projects Manager", "memberType": "Individual Member", "status": "Unknown", "since": "4/29/2021", "expiration": "", "email": "gwendolyn.climmons@fortbendcountytx.gov", "phone": "", "sourceTab": "Danny"},
];

const NOW_DATE = new Date('2026-05-05');
function emailTier(e) {
  const em = e.toLowerCase();
  if (em.includes('noemail')) return 0;
  if (em.match(/\.(gov|mil)$|houstontx\.gov|cityofhouston|fortbendcounty|missouricitytx|hctx\.net|portarthurtx|sugarlandtx|bellairetx|beaumonttexas|laportetx|cstx\.gov|houstonpolice|va\.gov|tcag\.state/)) return 3;
  if (em.match(/\.edu$|tsu\.edu|pvamu|uh\.edu|tamu\.edu|austincc/)) return 2;
  return 1;
}
function recencyScore(d) {
  const mo = (NOW_DATE - new Date(d)) / (1000 * 60 * 60 * 24 * 30.44);
  return mo <= 18 ? 3 : mo <= 48 ? 2 : mo <= 96 ? 1 : 0;
}
const SUSPENDED_MEMBERS = RAW_SUSPENDED.map((r, i) => {
  const [ln, fn, em, exp, st] = r;
  const es = emailTier(em),
    rs = recencyScore(exp),
    tot = es + rs,
    pri = tot >= 5 ? 'High' : tot >= 3 ? 'Medium' : 'Low';
  return {
    id: i + 1,
    lastName: ln,
    firstName: fn,
    name: `${fn} ${ln}`,
    email: em.toLowerCase(),
    memExp: exp,
    status: st === 'E' ? 'Expired' : 'Suspended',
    priority: pri,
    isGov: es === 3,
    isNoEmail: es === 0,
    score: tot
  };
});
const SEED_SPONSORS = [{
  id: 1,
  name: 'Care Solace',
  amount: 10000,
  status: 'Negotiating',
  contact: 'TBD',
  note: 'Requires President Duncan involvement'
}, {
  id: 2,
  name: 'Cigna',
  amount: 7500,
  status: 'Negotiating',
  contact: 'TBD',
  note: 'Requires President Duncan involvement'
}, {
  id: 3,
  name: 'Infrastructure Engineering Inc',
  amount: 5000,
  status: 'Negotiating',
  contact: 'TBD',
  note: 'Requires President Duncan involvement'
}, {
  id: 4,
  name: 'Dine & Dialogue',
  amount: 2500,
  status: 'Negotiating',
  contact: 'TBD',
  note: 'Requires President Duncan involvement'
}];
const SEED_TASKS = [{
  id: 1,
  title: 'Finalize 40th Anniversary Weekend run-of-show',
  assignee: 'Gethorio Davidson',
  assignedBy: 'Gethorio Davidson',
  priority: 'High',
  status: 'In Progress',
  due: '2026-05-15',
  channel: 'Annual Gala'
}, {
  id: 2,
  title: 'Confirm panelists — Cross Racial Collaboration',
  assignee: 'Cherrelle Duncan',
  assignedBy: 'Gethorio Davidson',
  priority: 'High',
  status: 'Completed',
  due: '2026-04-23',
  channel: 'PD Workshop Series'
}, {
  id: 3,
  title: 'Submit 40 for 40 Campaign launch materials',
  assignee: 'Gethorio Davidson',
  assignedBy: 'Gethorio Davidson',
  priority: 'High',
  status: 'In Progress',
  due: '2026-04-30',
  channel: '40 for 40 Campaign'
}, {
  id: 4,
  title: 'Board presentation packet v6 distribution',
  assignee: 'Gethorio Davidson',
  assignedBy: 'Gethorio Davidson',
  priority: 'Medium',
  status: 'Completed',
  due: '2026-04-20',
  channel: 'Individual Membership'
}, {
  id: 5,
  title: 'Membership drive — TSU student outreach',
  assignee: 'Dr. Ericka Brown',
  assignedBy: 'Gethorio Davidson',
  priority: 'Medium',
  status: 'Pending',
  due: '2026-05-30',
  channel: 'TSU Student Dues'
}, {
  id: 6,
  title: 'Cigna sponsorship proposal delivery',
  assignee: 'Cherrelle Duncan',
  assignedBy: 'Gethorio Davidson',
  priority: 'High',
  status: 'Pending',
  due: '2026-05-01',
  channel: 'Sponsorships'
}, {
  id: 7,
  title: 'Care Solace deck preparation',
  assignee: 'Dr. Kimberly Henderson',
  assignedBy: 'Gethorio Davidson',
  priority: 'High',
  status: 'In Progress',
  due: '2026-05-07',
  channel: 'Sponsorships'
}, {
  id: 8,
  title: 'Infrastructure Engineering Inc outreach',
  assignee: 'Dr. Kimberly Henderson',
  assignedBy: 'Gethorio Davidson',
  priority: 'Medium',
  status: 'Pending',
  due: '2026-05-14',
  channel: 'Sponsorships'
}, {
  id: 9,
  title: 'Re-engagement outreach — suspended members wave 1',
  assignee: 'Dr. Ericka Brown',
  assignedBy: 'Gethorio Davidson',
  priority: 'High',
  status: 'Pending',
  due: '2026-05-31',
  channel: 'Individual Membership'
}, {
  id: 10,
  title: '40th Anniversary keynote speaker confirmation',
  assignee: 'Cherrelle Duncan',
  assignedBy: 'Gethorio Davidson',
  priority: 'High',
  status: 'Pending',
  due: '2026-05-10',
  channel: 'Annual Gala'
}];
const STATUS_OPTS = ['Pending', 'In Progress', 'Completed', 'Blocked'];
const PRIORITY_OPTS = ['High', 'Medium', 'Low'];
const SPONSOR_STATUS = ['Negotiating', 'Committed', 'Active', 'Declined'];
const CHANNEL_OPTS = CHANNELS_12.map(c => c.name);
const PAGE_SIZE = 50;
const BOARD_ROLE = n => (BOARD.find(b => b.name === n) || {}).role || 'Board Member';
const initials = n => n.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const fmtCurr = n => '$' + Number(n || 0).toLocaleString('en-US');
const fmtTs = ts => {
  const d = new Date(ts);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) + ' ' + d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/Chicago',
    timeZoneName: 'short'
  });
};
function statusColor(s) {
  const m = {
    Completed: 'teal',
    Active: 'teal',
    Committed: 'teal',
    'In Progress': 'blue',
    Negotiating: 'blue',
    Pending: 'dim',
    Blocked: 'red',
    Declined: 'red',
    High: 'red',
    Medium: 'gold',
    Low: 'dim',
    Expired: 'gold',
    Suspended: 'dim'
  };
  return 'badge-' + (m[s] || 'dim');
}
const priColor = p => p === 'High' ? 'var(--red)' : p === 'Medium' ? 'var(--gold)' : 'var(--text-dim)';

// ── SNAPSHOT ──────────────────────────────────────────────────────────────────
function makeSnapshot(tasks, sponsors, actuals, contacted) {
  const totalActuals = CHANNELS_12.reduce((s, c) => s + (actuals[c.name] || 0), 0);
  return {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    tasks: {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'Completed').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      pending: tasks.filter(t => t.status === 'Pending').length,
      blocked: tasks.filter(t => t.status === 'Blocked').length,
      highPriority: tasks.filter(t => t.priority === 'High').length
    },
    sponsors: {
      count: sponsors.length,
      pipeline: sponsors.reduce((s, x) => s + Number(x.amount), 0)
    },
    actuals: {
      ...actuals
    },
    totalActuals,
    contacted: Object.keys(contacted).length,
    memberPool: SUSPENDED_MEMBERS.length
  };
}
function pruneSnapshots(snaps) {
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return snaps.filter(s => new Date(s.timestamp).getTime() > cutoff);
}

// ── API FUNCTIONS ─────────────────────────────────────────────────────────────
// ── SHARED COMPONENTS ────────────────────────────────────────────────────────
// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────

function Toast({
  msg,
  type,
  onClose
}) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: `toast toast-${type}`
  }, msg, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      marginLeft: 8,
      opacity: .7,
      fontSize: 14
    }
  }, "\u2715"));
}
function Modal({
  title,
  onClose,
  children,
  lg,
  xl
}) {
  React.useEffect(() => {
    const h = e => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: e => e.target === e.currentTarget && onClose()
  }, /*#__PURE__*/React.createElement("div", {
    className: `modal${lg ? ' modal-lg' : ''}${xl ? ' modal-xl' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-title"
  }, title), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-sm",
    onClick: onClose
  }, "\u2715")), children));
}

// ── RECIPIENT PICKER ──────────────────────────────────────────────────────────
const EMAIL_DB = [...BOARD.filter(b => b.email).map(b => ({
  label: `${b.name} — ${b.role}`,
  name: b.name,
  email: b.email,
  group: 'Board'
})), ...CURRENT_MEMBERS.filter(m => m.email).map(m => ({
  label: `${m.name}${m.title ? ' — ' + m.title : ''}`,
  name: m.name,
  email: m.email,
  group: 'Member'
}))];
function RecipientPicker({
  value,
  onChange
}) {
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [customMode, setCustomMode] = React.useState(false);
  const [customName, setCustomName] = React.useState('');
  const [customEmail, setCustomEmail] = React.useState('');
  const results = React.useMemo(() => {
    if (!search.trim()) return EMAIL_DB.slice(0, 10);
    const q = search.toLowerCase();
    return EMAIL_DB.filter(e => e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.label && e.label.toLowerCase().includes(q)).slice(0, 12);
  }, [search]);
  function selectEntry(e) {
    onChange({
      name: e.name,
      email: e.email
    });
    setSearch('');
    setOpen(false);
  }
  function applyCustom() {
    if (!customEmail.includes('@')) return;
    onChange({
      name: customName || customEmail,
      email: customEmail
    });
    setCustomMode(false);
    setCustomName('');
    setCustomEmail('');
  }
  function clear() {
    onChange(null);
    setSearch('');
    setOpen(false);
  }
  if (customMode) return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    placeholder: "Display name (optional)",
    value: customName,
    onChange: e => setCustomName(e.target.value)
  }), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    placeholder: "Email address *",
    value: customEmail,
    onChange: e => setCustomEmail(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-primary btn-sm",
    onClick: applyCustom,
    disabled: !customEmail.includes('@')
  }, "Use This Email"), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-sm",
    onClick: () => setCustomMode(false)
  }, "Cancel")));
  if (value) return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 14px',
      background: 'var(--surface2)',
      border: '1px solid var(--border)',
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 13
    }
  }, value.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontFamily: "'DM Mono',monospace",
      color: 'var(--text-dim)',
      marginTop: 2
    }
  }, value.email)), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-sm",
    onClick: clear,
    style: {
      fontSize: 11
    }
  }, "\u2715 Change"));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    placeholder: "Search by name, role, or email\u2026",
    value: search,
    onChange: e => {
      setSearch(e.target.value);
      setOpen(true);
    },
    onFocus: () => setOpen(true),
    onBlur: () => setTimeout(() => setOpen(false), 180)
  }), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      zIndex: 300,
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      boxShadow: 'var(--shadow-md)',
      maxHeight: 260,
      overflowY: 'auto',
      marginTop: 4
    }
  }, results.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px',
      fontSize: 12,
      color: 'var(--text-dim)'
    }
  }, "No matches found."), results.map((e, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    onMouseDown: () => selectEntry(e),
    style: {
      padding: '10px 14px',
      cursor: 'pointer',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    onMouseEnter: ev => ev.currentTarget.style.background = 'var(--surface2)',
    onMouseLeave: ev => ev.currentTarget.style.background = ''
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 500
    }
  }, e.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontFamily: "'DM Mono',monospace",
      color: 'var(--text-dim)',
      marginTop: 1
    }
  }, e.email)), /*#__PURE__*/React.createElement("span", {
    className: `badge ${e.group === 'Board' ? 'badge-gold' : 'badge-blue'}`,
    style: {
      fontSize: 9
    }
  }, e.group))), /*#__PURE__*/React.createElement("div", {
    onMouseDown: () => {
      setOpen(false);
      setCustomMode(true);
    },
    style: {
      padding: '10px 14px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      borderTop: '1px solid var(--border)',
      color: 'var(--text-mid)',
      fontSize: 12,
      fontWeight: 500
    },
    onMouseEnter: ev => ev.currentTarget.style.background = 'var(--surface2)',
    onMouseLeave: ev => ev.currentTarget.style.background = ''
  }, /*#__PURE__*/React.createElement("span", null, "\u270F"), " Enter external email address\u2026")));
}


// ── EMAIL TEMPLATE GENERATORS (local — no API required) ──────────────────────
// These generate professional emails entirely in the browser.
// Edit the draft in the EmailComposer before sending.

function draftTaskEmail(task, isNew) {
  const stripPrefix = n => (n || '').replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.|Rev\.)\s+/i, '').trim();
  const firstName = stripPrefix(task.assignee).split(' ')[0] || 'Board Member';
  const assignedBy = task.assignedBy || 'Gethorio Davidson';
  const assignedByFirst = stripPrefix(assignedBy).split(' ')[0] || 'Gethorio';
  const actionWord = isNew ? 'assigned' : 'reassigned';
  const annivRef = ['Annual Gala','40 for 40 Campaign','PD Workshop Series','Awards Luncheon'].includes(task.channel)
    ? '\n\nThis task is directly tied to our 40th Anniversary Weekend (June 5–7, 2026). Your timely action is essential to our celebration.'
    : '';
  const body = `Hi ${firstName},

I hope this message finds you well. ${assignedByFirst} has ${actionWord} the following task to you on behalf of the NFBPA Greater Houston Chapter:

Task: ${task.title}
Priority: ${task.priority}
Status: ${task.status}
Due Date: ${task.due || 'To be confirmed'}
Workstream: ${task.channel || 'General'}
${annivRef}

Please review and begin working on this at your earliest convenience. If you have any questions or need additional information, do not hesitate to reach out.

Thank you for your continued dedication and service.

NFBPA Greater Houston Chapter`;

  return Promise.resolve({
    subject: `[NFBPA Houston] ${task.priority} Priority Task — ${task.title}`,
    body: body.trim()
  });
}

function draftMemberEmail(member) {
  const stripPrefix = n => (n || '').replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.|Rev\.)\s+/i, '').trim();
  const firstName = stripPrefix(member.firstName || member.name.split(' ')[0]);
  const templates = [
    `Hi ${firstName},

We miss you at NFBPA Greater Houston! As we celebrate 40 years of impact, we want you back in our community of Black public administrators who are making a difference across Houston and the region.

We warmly invite you to rejoin and join us for our 40th Anniversary Weekend, June 5–7, 2026 — a milestone celebration featuring our Scholarship & Awards Luncheon, Public Administration Day, and an Anniversary Mixer.

Your membership expired on ${member.memExp}. Rejoining is quick and easy, and your voice and experience matter to this chapter.

We hope to see you there.

President Cherrelle Duncan
NFBPA Greater Houston Chapter`,

    `Dear ${firstName},

On behalf of the NFBPA Greater Houston Chapter, I am reaching out because we value your history with our organization and hope to welcome you back.

This year marks our 40th Anniversary, and we are celebrating with a special weekend, June 5–7, 2026. We would be honored to have you join us as a renewed member.

As an organization dedicated to excellence in Black public administration, leadership, and professional development, we need engaged members like you to continue our mission.

Please consider renewing your membership today at www.nfbpahoustontx.org.

President Cherrelle Duncan
NFBPA Greater Houston Chapter`
  ];

  const body = templates[member.id % 2];
  return Promise.resolve({
    subject: `You're Invited — NFBPA Greater Houston 40th Anniversary Weekend (June 5–7, 2026)`,
    body: body.trim()
  });
}

// ── EMAIL SYSTEM V3 — Real sending via EmailJS + Gmail/Outlook fallback ──────

function loadEmailCreds() {
  try {
    return JSON.parse(localStorage.getItem('nfbpa_emailjs') || 'null');
  } catch {
    return null;
  }
}
function saveEmailCreds(creds) {
  try {
    localStorage.setItem('nfbpa_emailjs', JSON.stringify(creds));
  } catch {}
}

// Try EmailJS first. If not configured, return the three web-compose links.
async function sendViaGmail(toEmail, subject, body, fromEmail, mode) {
  const enc = encodeURIComponent;
  const creds = loadEmailCreds();
  const gmailLink = `https://mail.google.com/mail/?view=cm&to=${enc(toEmail)}&su=${enc(subject)}&body=${enc(body)}`;
  const outlookLink = `https://outlook.office.com/mail/deeplink/compose?to=${enc(toEmail)}&subject=${enc(subject)}&body=${enc(body)}`;
  const mailtoLink = `mailto:${toEmail}?subject=${enc(subject)}&body=${enc(body)}`;
  if (creds?.serviceId && creds?.templateId && creds?.publicKey) {
    if (typeof emailjs === 'undefined') throw new Error('EmailJS library not loaded. Refresh the page.');
    const res = await emailjs.send(creds.serviceId, creds.templateId, {
      to_email: toEmail,
      to_name: toEmail,
      from_name: 'NFBPA Greater Houston Chapter',
      reply_to: fromEmail,
      subject,
      message: body
    }, creds.publicKey);
    if (res.status !== 200) throw new Error('Send failed: ' + res.text);
    return {
      sent: true,
      gmailLink,
      outlookLink,
      mailtoLink
    };
  }
  return {
    sent: false,
    gmailLink,
    outlookLink,
    mailtoLink
  };
}

// ── EMAIL SETUP MODAL ─────────────────────────────────────────────────────────
function EmailSetupModal({
  onClose,
  onSaved
}) {
  const existing = loadEmailCreds() || {};
  const [serviceId, setServiceId] = useState(existing.serviceId || '');
  const [templateId, setTemplateId] = useState(existing.templateId || '');
  const [publicKey, setPublicKey] = useState(existing.publicKey || '');
  const [testEmail, setTestEmail] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const isReady = serviceId.trim() && templateId.trim() && publicKey.trim();
  async function testSend() {
    if (!testEmail.includes('@') || !isReady) return;
    setTesting(true);
    setTestResult(null);
    try {
      await emailjs.send(serviceId, templateId, {
        to_email: testEmail,
        to_name: 'Test',
        from_name: 'NFBPA Greater Houston',
        reply_to: 'noreply@nfbpahoustontx.org',
        subject: 'NFBPA Dashboard — Email Integration Test',
        message: 'This is a test email from your NFBPA Greater Houston Chapter Dashboard. Your email integration is working correctly.'
      }, publicKey);
      setTestResult({
        ok: true,
        msg: '✓ Test email sent successfully! Check your inbox.'
      });
    } catch (e) {
      setTestResult({
        ok: false,
        msg: '✗ Failed: ' + e.message
      });
    }
    setTesting(false);
  }
  function save() {
    saveEmailCreds({
      serviceId: serviceId.trim(),
      templateId: templateId.trim(),
      publicKey: publicKey.trim()
    });
    onSaved();
    onClose();
  }
  function disconnect() {
    saveEmailCreds(null);
    localStorage.removeItem('nfbpa_emailjs');
    onSaved();
    onClose();
  }
  return /*#__PURE__*/React.createElement(Modal, {
    title: "\uD83D\uDCE7 Email Integration \u2014 Connect Gmail or Outlook",
    onClose: onClose,
    lg: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--gold-soft)',
      border: '1px solid rgba(154,116,40,.2)',
      borderRadius: 8,
      padding: 16,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13,
      marginBottom: 10,
      color: 'var(--gold-text)'
    }
  }, "Setup takes ~5 minutes and is free forever (200 emails/month free)"), /*#__PURE__*/React.createElement("ol", {
    style: {
      paddingLeft: 18,
      fontSize: 13,
      color: 'var(--text-mid)',
      lineHeight: 2.1,
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("li", null, "Go to ", /*#__PURE__*/React.createElement("a", {
    href: "https://www.emailjs.com",
    target: "_blank",
    rel: "noreferrer",
    style: {
      color: 'var(--gold)',
      fontWeight: 600
    }
  }, "emailjs.com"), " \u2014 create a free account"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Email Services"), " tab \u2192 ", /*#__PURE__*/React.createElement("strong", null, "Add New Service"), " \u2192 choose ", /*#__PURE__*/React.createElement("strong", null, "Gmail"), " or ", /*#__PURE__*/React.createElement("strong", null, "Outlook 365"), " \u2192 click ", /*#__PURE__*/React.createElement("strong", null, "Connect Account"), " and authorize"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Email Templates"), " tab \u2192 ", /*#__PURE__*/React.createElement("strong", null, "Create New Template"), " \u2192 set:", /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'DM Mono',monospace",
      fontSize: 11,
      background: 'var(--surface)',
      padding: '8px 12px',
      borderRadius: 4,
      marginTop: 6,
      lineHeight: 1.8
    }
  }, "To Email: ", '{{to_email}}', /*#__PURE__*/React.createElement("br", null), "Subject: ", '{{subject}}', /*#__PURE__*/React.createElement("br", null), "Message: ", '{{message}}')), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Account"), " tab \u2192 ", /*#__PURE__*/React.createElement("strong", null, "API Keys"), " \u2192 copy your ", /*#__PURE__*/React.createElement("strong", null, "Public Key")), /*#__PURE__*/React.createElement("li", null, "Paste all three IDs below and click ", /*#__PURE__*/React.createElement("strong", null, "Test Connection")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 12,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Service ID"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    placeholder: "service_xxxxxxx",
    value: serviceId,
    onChange: e => setServiceId(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Template ID"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    placeholder: "template_xxxxxxx",
    value: templateId,
    onChange: e => setTemplateId(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Public Key"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    placeholder: "xxxxxxxxxxxx",
    value: publicKey,
    onChange: e => setPublicKey(e.target.value)
  }))), isReady && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface2)',
      borderRadius: 8,
      padding: 14,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--text-mid)',
      marginBottom: 8
    }
  }, "Test your connection before saving"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    placeholder: "Send test to: your.email@gmail.com",
    value: testEmail,
    onChange: e => setTestEmail(e.target.value),
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary btn-sm",
    onClick: testSend,
    disabled: testing || !testEmail.includes('@')
  }, testing ? 'Sending…' : '⚡ Send Test')), testResult && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontSize: 13,
      fontWeight: 600,
      color: testResult.ok ? 'var(--teal)' : 'var(--red)',
      padding: '8px 12px',
      background: testResult.ok ? 'var(--teal-soft)' : 'var(--red-soft)',
      borderRadius: 6
    }
  }, testResult.msg)), /*#__PURE__*/React.createElement("div", {
    className: "form-actions"
  }, existing.serviceId && /*#__PURE__*/React.createElement("button", {
    className: "btn-danger btn-sm",
    onClick: disconnect,
    style: {
      marginRight: 'auto'
    }
  }, "Disconnect"), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary",
    onClick: save,
    disabled: !isReady
  }, "Save & Connect")));
}

// ── EMAIL COMPOSER V3 ─────────────────────────────────────────────────────────
function EmailComposer({
  toName,
  toEmail,
  initSubject,
  initBody,
  onClose,
  onSent,
  title
}) {
  const initTo = toEmail && toEmail.includes('@') ? { name: toName || toEmail, email: toEmail } : null;
  const [toRecipient, setToRecipient] = React.useState(initTo);
  const [from, setFrom] = React.useState(NFBPA_EMAILS[0].value);
  const [customFrom, setCustomFrom] = React.useState('');
  const useCustomFrom = from === '__custom__';
  const effectiveFrom = useCustomFrom ? customFrom : from;
  const [subject, setSubject] = React.useState(initSubject || '');
  const [body, setBody] = React.useState(initBody || '');
  const [step, setStep] = React.useState('compose'); // compose | send

  const effectiveTo = toRecipient ? toRecipient.email : '';
  const effectiveToName = toRecipient ? toRecipient.name : '';
  const canProceed = subject.trim() && body.trim() && effectiveTo.includes('@') &&
                     (!useCustomFrom || customFrom.includes('@'));

  const enc = encodeURIComponent;

  // Build links synchronously — no async, no await, no browser block
  const gmailLink    = effectiveTo ? `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(effectiveTo)}&su=${enc(subject)}&body=${enc(body)}` : '#';
  const outlookLink  = effectiveTo ? `https://outlook.live.com/mail/0/deeplink/compose?to=${enc(effectiveTo)}&subject=${enc(subject)}&body=${enc(body)}` : '#';
  const outlook365   = effectiveTo ? `https://outlook.office.com/mail/deeplink/compose?to=${enc(effectiveTo)}&subject=${enc(subject)}&body=${enc(body)}` : '#';
  const mailtoLink   = effectiveTo ? `mailto:${effectiveTo}?subject=${enc(subject)}&body=${enc(body)}` : '#';

  function logSent(method) {
    onSent && onSent({ ts: new Date().toISOString(), to: effectiveTo, toName: effectiveToName, from: effectiveFrom, method, subject });
  }

  // ── SEND STEP: live clickable links, no async ─────────────────────────────
  if (step === 'send') {
    const lnk = (href, bg, icon, label, sub) => /*#__PURE__*/React.createElement('a', {
      href, target: '_blank', rel: 'noreferrer',
      onClick: () => logSent(label),
      style: {
        display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
        borderRadius: 10, marginBottom: 10, textDecoration: 'none',
        background: bg, color: '#fff', cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.15)',
        transition: 'opacity .15s'
      }
    },
      /*#__PURE__*/React.createElement('span', { style: { fontSize: 24, flexShrink: 0 } }, icon),
      /*#__PURE__*/React.createElement('div', null,
        /*#__PURE__*/React.createElement('div', { style: { fontWeight: 700, fontSize: 14 } }, label),
        /*#__PURE__*/React.createElement('div', { style: { fontSize: 11, opacity: 0.85, marginTop: 2 } }, sub)
      ),
      /*#__PURE__*/React.createElement('span', { style: { marginLeft: 'auto', fontSize: 16 } }, '→')
    );

    return /*#__PURE__*/React.createElement(Modal, { title: '✉ Send Email', onClose, lg: true },
      /*#__PURE__*/React.createElement('div', {
        style: { background: 'var(--surface2)', borderRadius: 8, padding: '12px 16px', marginBottom: 18, fontSize: 13 }
      },
        /*#__PURE__*/React.createElement('div', { style: { marginBottom: 4 } }, /*#__PURE__*/React.createElement('strong', null, 'To: '), effectiveToName, ' ‹', effectiveTo, '›'),
        /*#__PURE__*/React.createElement('div', { style: { marginBottom: 4 } }, /*#__PURE__*/React.createElement('strong', null, 'Subject: '), subject),
        /*#__PURE__*/React.createElement('div', { style: { color: 'var(--text-dim)', fontSize: 11 } }, 'Click a button below to open it in your email client. The email will be pre-filled and ready to send.')
      ),
      lnk(gmailLink,   '#EA4335', '📧', 'Open in Gmail',         'Opens Gmail in a new tab — pre-filled'),
      lnk(outlookLink, '#0078D4', '📨', 'Open in Outlook.com',   'Personal Outlook / Hotmail accounts'),
      lnk(outlook365,  '#0F4A8A', '📩', 'Open in Outlook 365',   'Work/school Microsoft 365 accounts'),
      lnk(mailtoLink,  '#374151', '📬', 'Open Desktop Mail App',  'Outlook app, Apple Mail, Thunderbird'),
      /*#__PURE__*/React.createElement('div', {
        style: { fontSize: 11, color: 'var(--text-dim)', textAlign: 'center', padding: '8px 0 4px' }
      }, 'After the email opens, review it and press Send. It will arrive in the recipient\'s inbox.'),
      /*#__PURE__*/React.createElement('div', { className: 'form-actions' },
        /*#__PURE__*/React.createElement('button', { className: 'btn-ghost', onClick: () => setStep('compose') }, '← Edit'),
        /*#__PURE__*/React.createElement('button', { className: 'btn-primary', onClick: onClose }, 'Done')
      )
    );
  }

  // ── COMPOSE STEP ─────────────────────────────────────────────────────────
  return /*#__PURE__*/React.createElement(Modal, { title: title || 'Email Composer', onClose, lg: true },
    // TO
    /*#__PURE__*/React.createElement('div', { className: 'form-group' },
      /*#__PURE__*/React.createElement('label', { className: 'form-label' }, 'To — Recipient'),
      /*#__PURE__*/React.createElement(RecipientPicker, { value: toRecipient, onChange: setToRecipient })
    ),
    // FROM
    /*#__PURE__*/React.createElement('div', { className: 'form-group' },
      /*#__PURE__*/React.createElement('label', { className: 'form-label' }, 'From — NFBPA Email'),
      /*#__PURE__*/React.createElement('select', { className: 'form-input', value: from, onChange: e => setFrom(e.target.value) },
        NFBPA_EMAILS.map(b => /*#__PURE__*/React.createElement('option', { key: b.value, value: b.value }, b.label)),
        /*#__PURE__*/React.createElement('option', { value: '__custom__' }, '✏ Enter external address…')
      ),
      useCustomFrom && /*#__PURE__*/React.createElement('input', {
        className: 'form-input', style: { marginTop: 8 },
        placeholder: 'External from address (e.g. partner@org.gov)',
        value: customFrom, onChange: e => setCustomFrom(e.target.value)
      })
    ),
    // SUBJECT
    /*#__PURE__*/React.createElement('div', { className: 'form-group' },
      /*#__PURE__*/React.createElement('label', { className: 'form-label' }, 'Subject'),
      /*#__PURE__*/React.createElement('input', {
        className: 'form-input', value: subject,
        onChange: e => setSubject(e.target.value),
        placeholder: 'Email subject line'
      })
    ),
    // BODY
    /*#__PURE__*/React.createElement('div', { className: 'form-group' },
      /*#__PURE__*/React.createElement('label', { className: 'form-label' }, 'Message Body'),
      /*#__PURE__*/React.createElement('textarea', {
        className: 'form-input form-textarea',
        value: body, onChange: e => setBody(e.target.value),
        placeholder: 'Write your message here…'
      })
    ),
    // ACTIONS
    /*#__PURE__*/React.createElement('div', { className: 'form-actions' },
      /*#__PURE__*/React.createElement('button', { className: 'btn-ghost', onClick: onClose }, 'Cancel'),
      /*#__PURE__*/React.createElement('button', {
        className: 'btn-primary',
        disabled: !canProceed,
        onClick: () => setStep('send')
      }, '✉ Choose How to Send')
    )
  );
}


// ── SNAPSHOT PANEL ────────────────────────────────────────────────────────────
function SnapshotPanel({
  snapshots,
  onClose,
  onManual
}) {
  const sorted = [...snapshots].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  function delta(cur, prev, key, sub) {
    const cv = sub ? cur[key][sub] : cur[key],
      pv = sub ? prev[key][sub] : prev[key];
    const d = cv - pv;
    if (d === 0) return /*#__PURE__*/React.createElement("span", {
      className: "snap-delta neu"
    }, "\xB10");
    return /*#__PURE__*/React.createElement("span", {
      className: `snap-delta ${d > 0 ? 'pos' : 'neg'}`
    }, d > 0 ? '+' : '', typeof cv === 'number' && cv > 999 ? fmtCurr(d) : d);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "snapshot-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "snap-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "snap-title"
  }, "\uD83D\uDCCA Snapshots"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-sm",
    onClick: onManual
  }, "\uD83D\uDCF8 Save Now"), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-sm",
    onClick: onClose
  }, "\u2715"))), /*#__PURE__*/React.createElement("div", {
    className: "snap-body"
  }, sorted.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-dim)',
      fontSize: 13,
      textAlign: 'center',
      padding: 24
    }
  }, "No snapshots yet. One saves automatically on each session open."), sorted.map((s, i) => {
    const prev = sorted[i + 1] || null;
    return /*#__PURE__*/React.createElement("div", {
      key: s.id,
      className: "snap-item"
    }, /*#__PURE__*/React.createElement("div", {
      className: "snap-time"
    }, fmtTs(s.timestamp)), prev && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        marginBottom: 8
      }
    }, delta(s, prev, 'tasks', 'total'), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: 'var(--text-dim)'
      }
    }, "tasks"), delta(s, prev, 'sponsors', 'pipeline'), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: 'var(--text-dim)'
      }
    }, "pipeline"), delta(s, prev, 'totalActuals', null), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: 'var(--text-dim)'
      }
    }, "actuals"), delta(s, prev, 'contacted', null), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: 'var(--text-dim)'
      }
    }, "contacted")), /*#__PURE__*/React.createElement("div", {
      className: "snap-stats"
    }, /*#__PURE__*/React.createElement("div", {
      className: "snap-stat"
    }, "Tasks: ", /*#__PURE__*/React.createElement("strong", null, s.tasks.total), " (", s.tasks.completed, " done)"), /*#__PURE__*/React.createElement("div", {
      className: "snap-stat"
    }, "Pipeline: ", /*#__PURE__*/React.createElement("strong", null, fmtCurr(s.sponsors.pipeline))), /*#__PURE__*/React.createElement("div", {
      className: "snap-stat"
    }, "Actuals: ", /*#__PURE__*/React.createElement("strong", null, fmtCurr(s.totalActuals))), /*#__PURE__*/React.createElement("div", {
      className: "snap-stat"
    }, "Contacted: ", /*#__PURE__*/React.createElement("strong", null, s.contacted))));
  })));
}

// ── CHART COMPONENTS ──────────────────────────────────────────────────────────
function BarChartCJ({
  labels,
  values
}) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current || typeof Chart === 'undefined') return;
    if (chartRef.current) chartRef.current.destroy();
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: isDark ? '#c9a84c' : '#9A7428',
          borderRadius: 3,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: c => '$' + c.parsed.y.toLocaleString()
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: 'var(--text-dim)',
              font: {
                size: 9
              },
              maxRotation: 40,
              minRotation: 40
            },
            grid: {
              color: isDark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)'
            }
          },
          y: {
            ticks: {
              color: 'var(--text-dim)',
              font: {
                size: 9
              },
              callback: v => '$' + Number(v).toLocaleString()
            },
            grid: {
              color: isDark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)'
            }
          }
        }
      }
    });
    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "chartjs-wrapper"
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef
  }));
}
function PieChartCJ({
  labels,
  values,
  colors
}) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current || typeof Chart === 'undefined') return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: 'var(--surface)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: 'var(--text-mid)',
              font: {
                size: 10
              },
              padding: 10,
              boxWidth: 10
            }
          },
          tooltip: {
            callbacks: {
              label: c => `${c.label}: $${c.parsed.toLocaleString()}`
            }
          }
        }
      }
    });
    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "chartjs-wrapper"
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef
  }));
}

// ── OVERVIEW ──────────────────────────────────────────────────────────────────
function Overview({
  tasks,
  sponsors,
  actuals
}) {
  const totalRevTarget = CHANNELS_12.reduce((s, c) => s + c.target, 0);
  const sponsorChannelTgt = 26600;
  const sponsorPipeline = sponsors.reduce((s, x) => s + Number(x.amount), 0);
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const highPriority = tasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length;
  const highPool = SUSPENDED_MEMBERS.filter(m => m.priority === 'High').length;
  const totalActuals = CHANNELS_12.reduce((s, c) => s + (actuals[c.name] || 0), 0);
  const catMap = {};
  CHANNELS_12.forEach(c => {
    catMap[c.category] = (catMap[c.category] || 0) + c.target;
  });
  const pieEntries = Object.entries(catMap);
  const PIE_CLRS = ['#c9a84c', '#3ab5a0', '#5a8ae0', '#9a7ac0', '#e0a05a'];
  const barLabels = CHANNELS_12.map(c => c.name.length > 16 ? c.name.slice(0, 14) + '…' : c.name);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "grid-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi gold"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "FY 2026 Target"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-value gold"
  }, fmtCurr(totalRevTarget)), /*#__PURE__*/React.createElement("div", {
    className: "kpi-sub"
  }, "12 channels")), /*#__PURE__*/React.createElement("div", {
    className: "kpi teal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Sponsor Pipeline"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-value teal"
  }, fmtCurr(sponsorPipeline)), /*#__PURE__*/React.createElement("div", {
    className: "kpi-sub"
  }, sponsors.length, " orgs"), /*#__PURE__*/React.createElement("div", {
    className: "progress-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "progress-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "progress-fill teal",
    style: {
      width: Math.min(100, Math.round(sponsorPipeline / sponsorChannelTgt * 100)) + '%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: 'var(--text-dim)',
      marginTop: 4
    }
  }, Math.round(sponsorPipeline / sponsorChannelTgt * 100), "% of ", fmtCurr(sponsorChannelTgt)))), /*#__PURE__*/React.createElement("div", {
    className: "kpi blue"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Tasks Completed"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-value blue"
  }, completedTasks, "/", tasks.length), /*#__PURE__*/React.createElement("div", {
    className: "kpi-sub"
  }, highPriority, " high-priority open")), /*#__PURE__*/React.createElement("div", {
    className: "kpi red"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Recovery Pool"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-value red"
  }, highPool), /*#__PURE__*/React.createElement("div", {
    className: "kpi-sub"
  }, "High-priority of ", SUSPENDED_MEMBERS.length, " total"))), totalActuals > 0 && /*#__PURE__*/React.createElement("div", {
    className: "kpi teal",
    style: {
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Revenue Actuals to Date"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-value teal"
  }, fmtCurr(totalActuals)), /*#__PURE__*/React.createElement("div", {
    className: "progress-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "progress-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "progress-fill teal",
    style: {
      width: Math.min(100, Math.round(totalActuals / totalRevTarget * 100)) + '%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: 'var(--text-dim)',
      marginTop: 4
    }
  }, Math.round(totalActuals / totalRevTarget * 100), "% of ", fmtCurr(totalRevTarget), " target"))), /*#__PURE__*/React.createElement("div", {
    className: "grid-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Revenue by Channel \u2014 Target"), /*#__PURE__*/React.createElement(BarChartCJ, {
    labels: barLabels,
    values: CHANNELS_12.map(c => c.target)
  })), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Revenue Mix by Category"), /*#__PURE__*/React.createElement(PieChartCJ, {
    labels: pieEntries.map(([n]) => n),
    values: pieEntries.map(([, v]) => v),
    colors: PIE_CLRS
  }))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "12-Channel Revenue Plan \u2014 FY 2026"), /*#__PURE__*/React.createElement("table", {
    className: "data-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Channel"), /*#__PURE__*/React.createElement("th", null, "Category"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right'
    }
  }, "Target"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right'
    }
  }, "Actual"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right'
    }
  }, "% Target"))), /*#__PURE__*/React.createElement("tbody", null, CHANNELS_12.map((c, i) => {
    const act = actuals[c.name] || 0;
    return /*#__PURE__*/React.createElement("tr", {
      key: i
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 500
      }
    }, c.name), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "badge badge-dim"
    }, c.category)), /*#__PURE__*/React.createElement("td", {
      style: {
        textAlign: 'right',
        fontFamily: "'DM Mono',monospace",
        fontSize: 12,
        color: 'var(--gold)'
      }
    }, fmtCurr(c.target)), /*#__PURE__*/React.createElement("td", {
      style: {
        textAlign: 'right',
        fontFamily: "'DM Mono',monospace",
        fontSize: 12,
        color: act > 0 ? 'var(--teal)' : 'var(--text-dim)'
      }
    }, act > 0 ? fmtCurr(act) : '—'), /*#__PURE__*/React.createElement("td", {
      style: {
        textAlign: 'right',
        fontSize: 12,
        color: act >= c.target ? 'var(--teal)' : 'var(--text-dim)'
      }
    }, (c.target / totalRevTarget * 100).toFixed(1), "%"));
  }), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 2,
    style: {
      fontWeight: 700
    }
  }, "TOTAL"), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: 'right',
      fontFamily: "'DM Mono',monospace",
      fontWeight: 700,
      color: 'var(--gold)'
    }
  }, fmtCurr(totalRevTarget)), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: 'right',
      fontFamily: "'DM Mono',monospace",
      fontWeight: 700,
      color: 'var(--teal)'
    }
  }, totalActuals > 0 ? fmtCurr(totalActuals) : '—'), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: 'right',
      color: 'var(--text-dim)'
    }
  }, "100%"))))));
}

// ── BOARD ─────────────────────────────────────────────────────────────────────
function BoardPage() {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))',
      gap: 14,
      marginBottom: 22
    }
  }, BOARD.map(m => /*#__PURE__*/React.createElement("div", {
    key: m.id,
    className: "member-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "member-avatar"
  }, initials(m.name)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "member-name"
  }, m.name), /*#__PURE__*/React.createElement("div", {
    className: "member-role"
  }, m.role), m.email && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: 'var(--text-dim)',
      marginTop: 3,
      fontFamily: "'DM Mono',monospace"
    }
  }, m.email))))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Governance Note"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-mid)',
      lineHeight: 1.7
    }
  }, "All sponsorship conversations require President Cherrelle Duncan's direct involvement. Dr. Kimberly Henderson (Sponsorship Chair) leads pipeline development and proposal delivery. Task and member outreach emails are AI-drafted, sender-selectable from the board email list, require your confirmation before sending, and are logged per task and per member.")));
}

// ── TASKS PAGE ────────────────────────────────────────────────────────────────
// ── KANBAN TASKS SYSTEM V2 ─────────────────────────────────────────────────────
// Kanban board + Undo/Redo (50 steps) + Recycle Bin + Status Badges + KPI Tiles

const KANBAN_COLS = [{
  id: 'not_started',
  label: 'Not Started',
  color: '#6B7280'
}, {
  id: 'in_progress',
  label: 'In Progress',
  color: '#1F6FA8'
}, {
  id: 'blocked',
  label: 'Blocked',
  color: '#B83232'
}, {
  id: 'under_review',
  label: 'Under Review',
  color: '#CA8A04'
}, {
  id: 'complete',
  label: 'Complete',
  color: '#0D7A72'
}];
const PRI_COLOR = {
  Critical: '#DC2626',
  High: '#EA580C',
  Medium: '#CA8A04',
  Low: '#6B7280'
};
function normalizeStatus(s) {
  const m = {
    'Pending': 'not_started',
    'Not Started': 'not_started',
    'In Progress': 'in_progress',
    'Blocked': 'blocked',
    'Under Review': 'under_review',
    'Completed': 'complete',
    'Complete': 'complete'
  };
  return m[s] || s || 'not_started';
}
function colLabel(id) {
  return (KANBAN_COLS.find(c => c.id === id) || {}).label || id;
}

// ── UNDO/REDO HOOK ─────────────────────────────────────────────────────────────
function useUndoable(initial) {
  const [h, setH] = useState({
    past: [],
    present: initial,
    future: []
  });
  const set = v => setH(s => {
    const next = typeof v === 'function' ? v(s.present) : v;
    return {
      past: [...s.past.slice(-49), s.present],
      present: next,
      future: []
    };
  });
  const undo = () => setH(s => {
    if (!s.past.length) return s;
    const past = [...s.past],
      prev = past.pop();
    return {
      past,
      present: prev,
      future: [s.present, ...s.future]
    };
  });
  const redo = () => setH(s => {
    if (!s.future.length) return s;
    const [next, ...future] = s.future;
    return {
      past: [...s.past, s.present],
      present: next,
      future
    };
  });
  return [h.present, set, undo, redo, h.past.length > 0, h.future.length > 0];
}

// ── STATUS BADGES ──────────────────────────────────────────────────────────────
function getTaskBadges(task) {
  const badges = [],
    now = new Date();
  const due = task.due ? new Date(task.due + 'T23:59:59') : null;
  if (task.colId !== 'complete') {
    if (due) {
      const d = Math.round((due - now) / 86400000);
      if (d < 0) badges.push({
        key: 'ov',
        txt: `🔴 ${Math.abs(d)}d Overdue`,
        bg: '#FEE2E2',
        col: '#B83232'
      });else if (d <= 3) badges.push({
        key: 'ds',
        txt: '🟡 Due Soon',
        bg: '#FEF9C3',
        col: '#854D0E'
      });
    }
    if (task.colId === 'in_progress' && task.lastActivity) {
      if (Math.round((now - new Date(task.lastActivity)) / 86400000) >= 7) badges.push({
        key: 'st',
        txt: '⚫ Stale',
        bg: '#F3F4F6',
        col: '#4B5563'
      });
    }
  }
  return badges;
}

// ── DRAG-DROP CARD ─────────────────────────────────────────────────────────────
// Pure HTML5 DnD — zero external library, works everywhere
function KanbanBoard({
  cols,
  tasks,
  onMove,
  onEdit,
  onSoftDelete,
  onDuplicate,
  onNotify,
  checked,
  onCheck
}) {
  const [dragging, setDragging] = useState(null); // task id being dragged
  const [overCol, setOverCol] = useState(null);
  function handleDragStart(e, id) {
    setDragging(id);
    e.dataTransfer.effectAllowed = 'move';
  }
  function handleDrop(e, colId) {
    e.preventDefault();
    if (dragging && colId !== (tasks.find(t => t.id === dragging) || {}).colId) {
      onMove(dragging, colId);
    }
    setDragging(null);
    setOverCol(null);
  }
  return React.createElement('div', {
    style: {
      display: 'flex',
      gap: 14,
      minWidth: 1240,
      alignItems: 'flex-start'
    }
  }, cols.map(col => {
    const colTasks = tasks.filter(t => t.colId === col.id);
    const isOver = overCol === col.id;
    return React.createElement('div', {
      key: col.id,
      style: {
        flex: '0 0 230px',
        display: 'flex',
        flexDirection: 'column'
      },
      onDragOver: e => {
        e.preventDefault();
        setOverCol(col.id);
      },
      onDragLeave: () => setOverCol(null),
      onDrop: e => handleDrop(e, col.id)
    },
    // Column header
    React.createElement('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
        paddingBottom: 8,
        borderBottom: `3px solid ${col.color}`
      }
    }, React.createElement('span', {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: col.color,
        textTransform: 'uppercase',
        letterSpacing: '.06em'
      }
    }, col.label), React.createElement('span', {
      style: {
        fontSize: 10,
        fontWeight: 700,
        background: col.color,
        color: '#fff',
        padding: '1px 7px',
        borderRadius: 10
      }
    }, colTasks.length)),
    // Drop zone
    React.createElement('div', {
      style: {
        minHeight: 80,
        padding: 4,
        background: isOver ? 'rgba(30,58,95,0.06)' : 'transparent',
        borderRadius: 8,
        border: isOver ? '2px dashed var(--navy)' : '2px dashed transparent',
        transition: 'all .15s'
      }
    }, colTasks.length === 0 && React.createElement('div', {
      style: {
        padding: '20px 8px',
        textAlign: 'center',
        fontSize: 11,
        color: 'var(--text-dim)'
      }
    }, 'Drop tasks here'), colTasks.map(task => {
      const badges = getTaskBadges(task);
      const pc = task.priority || 'Medium';
      const pColor = PRI_COLOR[pc] || '#6B7280';
      const pct = task.percent || 0;
      const isDraggingThis = dragging === task.id;
      return React.createElement('div', {
        key: task.id,
        draggable: true,
        onDragStart: e => handleDragStart(e, task.id),
        onDragEnd: () => {
          setDragging(null);
          setOverCol(null);
        },
        style: {
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderLeft: `4px solid ${pColor}`,
          borderRadius: 8,
          marginBottom: 8,
          boxShadow: isDraggingThis ? '0 8px 24px rgba(0,0,0,.18)' : 'var(--shadow)',
          opacity: isDraggingThis ? 0.5 : 1,
          cursor: 'grab',
          transition: 'box-shadow .1s',
          position: 'relative'
        }
      },
      // Checkbox
      React.createElement('input', {
        type: 'checkbox',
        checked: !!checked[task.id],
        onChange: () => onCheck(task.id),
        onClick: e => e.stopPropagation(),
        style: {
          position: 'absolute',
          top: 9,
          right: 9,
          cursor: 'pointer',
          width: 14,
          height: 14
        }
      }), React.createElement('div', {
        style: {
          padding: '10px 26px 10px 12px'
        }
      },
      // Title
      React.createElement('div', {
        style: {
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--text)',
          marginBottom: 5,
          lineHeight: 1.4
        }
      }, task.title),
      // Meta row
      React.createElement('div', {
        style: {
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 5,
          alignItems: 'center'
        }
      }, task.assignee && React.createElement('span', {
        style: {
          fontSize: 10,
          color: 'var(--text-dim)'
        }
      }, '👤 ' + task.assignee), task.due && React.createElement('span', {
        style: {
          fontSize: 10,
          fontFamily: "'DM Mono',monospace",
          color: 'var(--text-dim)'
        }
      }, '📅 ' + task.due), React.createElement('span', {
        style: {
          fontSize: 10,
          fontWeight: 700,
          color: pColor
        }
      }, pc)),
      // Badges
      badges.length > 0 && React.createElement('div', {
        style: {
          display: 'flex',
          gap: 4,
          flexWrap: 'wrap',
          marginBottom: 5
        }
      }, badges.map(b => React.createElement('span', {
        key: b.key,
        style: {
          fontSize: 9,
          fontWeight: 700,
          padding: '2px 5px',
          borderRadius: 3,
          background: b.bg,
          color: b.col
        }
      }, b.txt))),
      // Progress
      React.createElement('div', {
        style: {
          marginBottom: 6
        }
      }, React.createElement('div', {
        style: {
          height: 3,
          background: 'var(--border)',
          borderRadius: 2,
          overflow: 'hidden'
        }
      }, React.createElement('div', {
        style: {
          height: '100%',
          width: pct + '%',
          background: pct === 100 ? 'var(--teal)' : 'var(--blue)',
          borderRadius: 2,
          transition: 'width .3s'
        }
      })), React.createElement('div', {
        style: {
          fontSize: 9,
          color: 'var(--text-dim)',
          marginTop: 2
        }
      }, 'Progress: ' + pct + '%')),
      // Channel
      task.channel && React.createElement('div', {
        style: {
          fontSize: 9,
          color: 'var(--text-dim)',
          marginBottom: 5
        }
      }, React.createElement('span', {
        style: {
          background: 'var(--surface2)',
          padding: '1px 5px',
          borderRadius: 3
        }
      }, task.channel)),
      // Actions
      React.createElement('div', {
        style: {
          display: 'flex',
          gap: 4,
          flexWrap: 'wrap'
        }
      }, React.createElement('button', {
        className: 'btn-ghost btn-sm',
        style: {
          fontSize: 10,
          padding: '3px 8px'
        },
        onClick: e => {
          e.stopPropagation();
          onEdit(task);
        }
      }, 'Edit'), React.createElement('button', {
        className: 'btn-ghost btn-sm',
        style: {
          fontSize: 10,
          padding: '3px 8px'
        },
        onClick: e => {
          e.stopPropagation();
          onDuplicate(task);
        }
      }, '⊕'), (BOARD.find(b => b.name === task.assignee) || {}).email && React.createElement('button', {
        className: 'btn-teal btn-sm',
        style: {
          fontSize: 10,
          padding: '3px 8px'
        },
        onClick: e => {
          e.stopPropagation();
          onNotify(task);
        }
      }, '✉'), React.createElement('button', {
        className: 'btn-danger btn-sm',
        style: {
          fontSize: 10,
          padding: '3px 8px'
        },
        onClick: e => {
          e.stopPropagation();
          onSoftDelete(task.id);
        }
      }, '🗑'))));
    })));
  }));
}

// ── RECYCLE BIN ────────────────────────────────────────────────────────────────
function RecycleBin({
  deleted,
  onRestore,
  onPermDelete,
  onEmptyAll,
  onClose
}) {
  const now = new Date();
  const live = deleted.filter(t => now - new Date(t.deletedAt) < 30 * 86400000);
  return React.createElement('div', {
    className: 'snapshot-panel'
  }, React.createElement('div', {
    className: 'snap-header'
  }, React.createElement('div', {
    className: 'snap-title'
  }, '🗑 Recycle Bin (' + live.length + ')'), React.createElement('div', {
    style: {
      display: 'flex',
      gap: 8
    }
  }, live.length > 0 && React.createElement('button', {
    className: 'btn-danger btn-sm',
    onClick: onEmptyAll
  }, 'Empty All'), React.createElement('button', {
    className: 'btn-ghost btn-sm',
    onClick: onClose
  }, '✕'))), React.createElement('div', {
    className: 'snap-body'
  }, live.length === 0 && React.createElement('div', {
    style: {
      color: 'var(--text-dim)',
      fontSize: 13,
      textAlign: 'center',
      padding: 24
    }
  }, 'Recycle Bin is empty.'), live.map(t => {
    const daysLeft = 30 - Math.floor((now - new Date(t.deletedAt)) / 86400000);
    return React.createElement('div', {
      key: t.id,
      className: 'snap-item'
    }, React.createElement('div', {
      style: {
        fontSize: 13,
        fontWeight: 600,
        marginBottom: 4
      }
    }, t.title), React.createElement('div', {
      style: {
        fontSize: 11,
        color: 'var(--text-dim)',
        marginBottom: 8
      }
    }, (t.assignee || 'Unassigned') + ' · ' + t.priority + ' · Removed ' + new Date(t.deletedAt).toLocaleDateString('en-US') + ' · ' + daysLeft + 'd left'), React.createElement('div', {
      style: {
        display: 'flex',
        gap: 8
      }
    }, React.createElement('button', {
      className: 'btn-teal btn-sm',
      onClick: () => onRestore(t.id)
    }, '↩ Restore'), React.createElement('button', {
      className: 'btn-danger btn-sm',
      onClick: () => onPermDelete(t.id)
    }, 'Delete Forever')));
  })));
}

// ── TASK FORM ──────────────────────────────────────────────────────────────────
function TaskFormModal({
  task,
  onSave,
  onClose
}) {
  const isNew = !task.id;
  const [f, setF] = useState({
    title: '',
    assignee: '',
    assignedBy: 'Gethorio Davidson',
    priority: 'Medium',
    colId: 'not_started',
    due: '',
    channel: '',
    percent: 0,
    notes: '',
    ...(task || {})
  });
  const [err, setErr] = useState({});
  const s = (k, v) => setF(p => ({
    ...p,
    [k]: v
  }));
  function save() {
    const e = {};
    if (!f.title?.trim()) e.title = 'Please add a task title before saving.';
    if (!f.due) e.due = 'Please select a due date.';
    setErr(e);
    if (Object.keys(e).length) return;
    onSave({
      ...f,
      id: f.id || crypto.randomUUID(),
      createdAt: f.createdAt || new Date().toISOString(),
      lastActivity: new Date().toISOString()
    });
  }
  return React.createElement(Modal, {
    title: isNew ? 'Add Task' : 'Edit Task',
    onClose,
    lg: true
  }, React.createElement('div', {
    className: 'form-group'
  }, React.createElement('label', {
    className: 'form-label'
  }, 'Task Title * ', React.createElement('span', {
    style: {
      fontSize: 10,
      color: 'var(--text-dim)'
    }
  }, '(max 80 chars)')), React.createElement('input', {
    className: 'form-input',
    maxLength: 80,
    placeholder: "What needs to get done?",
    value: f.title,
    onChange: e => s('title', e.target.value)
  }), err.title && React.createElement('div', {
    style: {
      fontSize: 11,
      color: 'var(--red)',
      marginTop: 4
    }
  }, err.title)), React.createElement('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12
    }
  }, React.createElement('div', {
    className: 'form-group'
  }, React.createElement('label', {
    className: 'form-label'
  }, 'Task Owner'), React.createElement('select', {
    className: 'form-input',
    value: f.assignee,
    onChange: e => s('assignee', e.target.value)
  }, React.createElement('option', {
    value: ''
  }, 'Select board member…'), BOARD.map(b => React.createElement('option', {
    key: b.id,
    value: b.name
  }, b.name)))), React.createElement('div', {
    className: 'form-group'
  }, React.createElement('label', {
    className: 'form-label'
  }, 'Assigned By'), React.createElement('select', {
    className: 'form-input',
    value: f.assignedBy,
    onChange: e => s('assignedBy', e.target.value)
  }, BOARD.map(b => React.createElement('option', {
    key: b.id,
    value: b.name
  }, b.name))))), React.createElement('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 12
    }
  }, React.createElement('div', {
    className: 'form-group'
  }, React.createElement('label', {
    className: 'form-label'
  }, 'Priority'), React.createElement('select', {
    className: 'form-input',
    value: f.priority,
    onChange: e => s('priority', e.target.value)
  }, ['Critical', 'High', 'Medium', 'Low'].map(p => React.createElement('option', {
    key: p
  }, p)))), React.createElement('div', {
    className: 'form-group'
  }, React.createElement('label', {
    className: 'form-label'
  }, 'Deliverable Status'), React.createElement('select', {
    className: 'form-input',
    value: f.colId,
    onChange: e => s('colId', e.target.value)
  }, KANBAN_COLS.map(c => React.createElement('option', {
    key: c.id,
    value: c.id
  }, c.label)))), React.createElement('div', {
    className: 'form-group'
  }, React.createElement('label', {
    className: 'form-label'
  }, 'Due Date *'), React.createElement('input', {
    className: 'form-input',
    type: 'date',
    value: f.due,
    onChange: e => s('due', e.target.value)
  }), err.due && React.createElement('div', {
    style: {
      fontSize: 11,
      color: 'var(--red)',
      marginTop: 4
    }
  }, err.due))), React.createElement('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12
    }
  }, React.createElement('div', {
    className: 'form-group'
  }, React.createElement('label', {
    className: 'form-label'
  }, 'Channel / Workstream'), React.createElement('select', {
    className: 'form-input',
    value: f.channel,
    onChange: e => s('channel', e.target.value)
  }, React.createElement('option', {
    value: ''
  }, 'Select…'), CHANNEL_OPTS.map(o => React.createElement('option', {
    key: o
  }, o)))), React.createElement('div', {
    className: 'form-group'
  }, React.createElement('label', {
    className: 'form-label'
  }, 'Progress — ' + f.percent + '% Complete'), React.createElement('input', {
    type: 'range',
    min: 0,
    max: 100,
    step: 5,
    value: f.percent,
    onChange: e => s('percent', Number(e.target.value)),
    style: {
      width: '100%',
      marginTop: 10,
      accentColor: 'var(--navy)'
    }
  }))), React.createElement('div', {
    className: 'form-group'
  }, React.createElement('label', {
    className: 'form-label'
  }, 'Notes ', React.createElement('span', {
    style: {
      fontSize: 10,
      color: 'var(--text-dim)'
    }
  }, '(optional, max 500 chars)')), React.createElement('textarea', {
    className: 'form-input form-textarea',
    maxLength: 500,
    rows: 3,
    placeholder: 'Any additional context, instructions, or links?',
    value: f.notes || '',
    onChange: e => s('notes', e.target.value)
  })), React.createElement('div', {
    className: 'form-actions'
  }, React.createElement('button', {
    className: 'btn-ghost',
    onClick: onClose
  }, 'Cancel'), React.createElement('button', {
    className: 'btn-primary',
    onClick: save
  }, isNew ? 'Save Task' : 'Update Task')));
}

// ── TASKS PAGE ─────────────────────────────────────────────────────────────────
function TasksPage({
  tasks: rawTasks,
  setTasks: setRawTasks,
  sentLog,
  setSentLog,
  showAlert
}) {
  const normTasks = t => t.map(x => ({
    ...x,
    colId: x.colId || normalizeStatus(x.status || 'Pending'),
    percent: x.percent || 0,
    lastActivity: x.lastActivity || x.createdAt || new Date().toISOString(),
    id: x.id || crypto.randomUUID()
  }));
  const [tasks, setTasks, undo, redo, canUndo, canRedo] = useUndoable(normTasks(rawTasks));
  const [deleted, setDeleted] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('nfbpa_v14_recycle') || '[]');
    } catch {
      return [];
    }
  });
  const [search, setSearch] = useState('');
  const [fPri, setFPri] = useState('all');
  const [fOwner, setFOwner] = useState('all');
  const [fCol, setFCol] = useState('all');
  const [checked, setChecked] = useState({});
  const [modal, setModal] = useState(null);
  const [showBin, setShowBin] = useState(false);
  const [draftDlg, setDraftDlg] = useState(null);
  useEffect(() => {
    setRawTasks(tasks);
  }, [tasks]);
  useEffect(() => {
    try {
      localStorage.setItem('nfbpa_v14_recycle', JSON.stringify(deleted));
    } catch {}
  }, [deleted]);

  // Keyboard shortcuts
  useEffect(() => {
    const h = e => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'n' || e.key === 'N') setModal({
        type: 'add',
        task: {}
      });
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        showAlert('↩ Undone.', 'info');
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'z' && e.shiftKey)) {
        e.preventDefault();
        redo();
        showAlert('↪ Redone.', 'info');
      }
      if (e.key === 'Escape') {
        setModal(null);
        setDraftDlg(null);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [undo, redo]);
  const now = new Date();
  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + 7);
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return tasks.filter(t => {
      if (q && !t.title?.toLowerCase().includes(q) && !t.assignee?.toLowerCase().includes(q)) return false;
      if (fPri !== 'all' && t.priority !== fPri) return false;
      if (fOwner !== 'all' && t.assignee !== fOwner) return false;
      if (fCol !== 'all' && t.colId !== fCol) return false;
      return true;
    });
  }, [tasks, search, fPri, fOwner, fCol]);
  const overdue = tasks.filter(t => t.colId !== 'complete' && t.due && new Date(t.due) < now);
  const dueWeek = tasks.filter(t => t.colId !== 'complete' && t.due && new Date(t.due) >= now && new Date(t.due) <= endOfWeek);
  const stale = tasks.filter(t => t.colId === 'in_progress' && t.lastActivity && Math.round((now - new Date(t.lastActivity)) / 86400000) >= 7);
  const complete = tasks.filter(t => t.colId === 'complete');
  const overallPct = tasks.length ? Math.round(complete.length / tasks.length * 100) : 0;
  function moveTask(id, colId) {
    setTasks(prev => prev.map(t => t.id === id ? {
      ...t,
      colId,
      lastActivity: new Date().toISOString()
    } : t));
    showAlert('✓ Task status updated.', 'success');
  }
  function saveTask(task) {
    const isNew = !tasks.find(t => t.id === task.id);
    setTasks(prev => isNew ? [...prev, task] : prev.map(t => t.id === task.id ? task : t));
    setModal(null);
    showAlert(isNew ? '✓ Task saved successfully.' : '✓ Task updated.', 'success');
    if (isNew && task.assignee && (BOARD.find(b => b.name === task.assignee) || {}).email) openNotify(task);
  }
  function softDelete(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    setTasks(prev => prev.filter(t => t.id !== id));
    setDeleted(prev => [...prev, {
      ...task,
      deletedAt: new Date().toISOString()
    }]);
    showAlert('✓ Task moved to Recycle Bin. Restore it anytime within 30 days.', 'success');
  }
  function restoreTask(id) {
    const task = deleted.find(t => t.id === id);
    if (!task) return;
    const {
      deletedAt,
      ...rest
    } = task;
    setTasks(prev => [...prev, rest]);
    setDeleted(prev => prev.filter(t => t.id !== id));
    showAlert('✓ Task restored from Recycle Bin.', 'success');
  }
  function permDelete(id) {
    setDeleted(prev => prev.filter(t => t.id !== id));
    showAlert('✓ Task permanently removed.', 'success');
  }
  function duplicateTask(task) {
    const dupe = {
      ...task,
      id: crypto.randomUUID(),
      title: 'Copy of ' + task.title,
      colId: 'not_started',
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      percent: 0
    };
    setTasks(prev => [...prev, dupe]);
    showAlert('✓ Task duplicated successfully.', 'success');
  }
  async function openNotify(task) {
    try {
      const d = await draftTaskEmail(task, true);
      setDraftDlg({
        task,
        ...d
      });
    } catch {
      showAlert('Could not generate email draft.', 'error');
    }
  }
  const checkedIds = Object.keys(checked).filter(k => checked[k]);
  function bulkComplete() {
    setTasks(prev => prev.map(t => checkedIds.includes(t.id) ? {
      ...t,
      colId: 'complete',
      percent: 100,
      lastActivity: new Date().toISOString()
    } : t));
    setChecked({});
    showAlert('✓ Tasks marked complete.', 'success');
  }
  function bulkDelete() {
    checkedIds.forEach(id => softDelete(id));
    setChecked({});
  }
  function exportCSV() {
    const BOM = '\uFEFF';
    const h = 'Task ID,Task Title,Task Owner,Due Date,Priority,Deliverable Status,Percent Complete,Created Date,Channel';
    const rows = tasks.map(t => `"${t.id}","${t.title}","${t.assignee || ''}","${t.due || ''}","${t.priority}","${colLabel(t.colId)}","${t.percent || 0}","${(t.createdAt || '').split('T')[0]}","${t.channel || ''}"`);
    const blob = new Blob([BOM + [h, ...rows].join('\n')], {
      type: 'text/csv;charset=utf-8'
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'nfbpa_tasks.csv';
    a.click();
    showAlert('✓ Your task list has been exported.', 'success');
  }
  const owners = [...new Set(tasks.map(t => t.assignee).filter(Boolean))].sort();
  const binCount = deleted.filter(t => now - new Date(t.deletedAt) < 30 * 86400000).length;
  const hasFilters = search || fPri !== 'all' || fOwner !== 'all' || fCol !== 'all';
  return React.createElement('div', null,
  // KPI Tiles
  React.createElement('div', {
    className: 'grid-4',
    style: {
      marginBottom: 20
    }
  }, React.createElement('div', {
    className: 'kpi blue'
  }, React.createElement('div', {
    className: 'kpi-label'
  }, 'Total Tasks'), React.createElement('div', {
    className: 'kpi-value blue'
  }, tasks.length), React.createElement('div', {
    className: 'kpi-sub'
  }, complete.length + ' complete'), React.createElement('div', {
    className: 'progress-wrap'
  }, React.createElement('div', {
    className: 'progress-bar'
  }, React.createElement('div', {
    className: 'progress-fill teal',
    style: {
      width: overallPct + '%'
    }
  })), React.createElement('div', {
    style: {
      fontSize: 10,
      color: 'var(--text-dim)',
      marginTop: 4
    }
  }, overallPct + '% overall progress'))), React.createElement('div', {
    className: 'kpi red'
  }, React.createElement('div', {
    className: 'kpi-label'
  }, 'Overdue'), React.createElement('div', {
    className: 'kpi-value red'
  }, overdue.length), React.createElement('div', {
    className: 'kpi-sub'
  }, overdue.length === 0 ? 'All on track' : 'Require immediate attention')), React.createElement('div', {
    className: 'kpi gold'
  }, React.createElement('div', {
    className: 'kpi-label'
  }, 'Due This Week'), React.createElement('div', {
    className: 'kpi-value gold'
  }, dueWeek.length), React.createElement('div', {
    className: 'kpi-sub'
  }, 'Next 7 days')), React.createElement('div', {
    className: 'kpi',
    style: {
      borderTop: '3px solid #6B7280'
    }
  }, React.createElement('div', {
    className: 'kpi-label'
  }, 'Stale Tasks'), React.createElement('div', {
    className: 'kpi-value',
    style: {
      color: '#6B7280'
    }
  }, stale.length), React.createElement('div', {
    className: 'kpi-sub'
  }, 'No activity 7+ days'))),
  // Filters + Action bar
  React.createElement('div', {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      alignItems: 'center',
      marginBottom: 14
    }
  }, React.createElement('input', {
    className: 'search-input',
    style: {
      flex: '1 1 180px',
      minWidth: 160
    },
    placeholder: 'Search by task name or owner…',
    value: search,
    onChange: e => setSearch(e.target.value)
  }), React.createElement('select', {
    className: 'filter-select',
    value: fPri,
    onChange: e => setFPri(e.target.value)
  }, React.createElement('option', {
    value: 'all'
  }, 'All Priority'), ['Critical', 'High', 'Medium', 'Low'].map(p => React.createElement('option', {
    key: p
  }, p))), React.createElement('select', {
    className: 'filter-select',
    value: fOwner,
    onChange: e => setFOwner(e.target.value)
  }, React.createElement('option', {
    value: 'all'
  }, 'All Owners'), owners.map(o => React.createElement('option', {
    key: o,
    value: o
  }, o))), React.createElement('select', {
    className: 'filter-select',
    value: fCol,
    onChange: e => setFCol(e.target.value)
  }, React.createElement('option', {
    value: 'all'
  }, 'All Status'), KANBAN_COLS.map(c => React.createElement('option', {
    key: c.id,
    value: c.id
  }, c.label))), hasFilters && React.createElement('button', {
    className: 'btn-ghost btn-sm',
    onClick: () => {
      setSearch('');
      setFPri('all');
      setFOwner('all');
      setFCol('all');
    }
  }, '✕ Clear')), React.createElement('div', {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      alignItems: 'center',
      marginBottom: 16
    }
  }, React.createElement('button', {
    className: 'btn-primary btn-sm',
    onClick: () => setModal({
      type: 'add',
      task: {}
    })
  }, '+ Add Task'), React.createElement('button', {
    className: 'btn-ghost btn-sm',
    onClick: () => {
      undo();
      showAlert('↩ Undone.', 'info');
    },
    disabled: !canUndo,
    style: {
      opacity: canUndo ? 1 : 0.4
    },
    title: 'Undo (Ctrl+Z)'
  }, '↩ Undo'), React.createElement('button', {
    className: 'btn-ghost btn-sm',
    onClick: () => {
      redo();
      showAlert('↪ Redone.', 'info');
    },
    disabled: !canRedo,
    style: {
      opacity: canRedo ? 1 : 0.4
    },
    title: 'Redo (Ctrl+Y)'
  }, '↪ Redo'), React.createElement('button', {
    className: 'btn-ghost btn-sm',
    onClick: () => setShowBin(true)
  }, '🗑 Recycle Bin' + (binCount > 0 ? ' (' + binCount + ')' : '')), React.createElement('button', {
    className: 'btn-ghost btn-sm',
    onClick: exportCSV
  }, '⬇ CSV'), checkedIds.length > 0 && React.createElement('div', {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center',
      padding: '4px 10px',
      background: 'var(--blue-soft)',
      border: '1px solid rgba(31,111,168,.2)',
      borderRadius: 6
    }
  }, React.createElement('span', {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--blue)'
    }
  }, checkedIds.length + ' selected'), React.createElement('button', {
    className: 'btn-teal btn-sm',
    onClick: bulkComplete
  }, 'Mark Complete'), React.createElement('button', {
    className: 'btn-danger btn-sm',
    onClick: bulkDelete
  }, '🗑 Remove'), React.createElement('button', {
    className: 'btn-ghost btn-sm',
    onClick: () => setChecked({})
  }, 'Clear')), React.createElement('div', {
    style: {
      marginLeft: 'auto',
      fontSize: 11,
      color: 'var(--text-dim)'
    }
  }, filtered.length + ' task' + (filtered.length !== 1 ? 's' : '') + (hasFilters ? ' (filtered from ' + tasks.length + ')' : ''))),
  // Kanban Board
  React.createElement('div', {
    style: {
      overflowX: 'auto',
      paddingBottom: 16
    }
  }, React.createElement(KanbanBoard, {
    cols: KANBAN_COLS,
    tasks: filtered,
    onMove: moveTask,
    onEdit: t => setModal({
      type: 'edit',
      task: t
    }),
    onSoftDelete: softDelete,
    onDuplicate: duplicateTask,
    onNotify: openNotify,
    checked,
    onCheck: id => setChecked(p => ({
      ...p,
      [id]: !p[id]
    }))
  })),
  // Empty state
  filtered.length === 0 && React.createElement('div', {
    style: {
      textAlign: 'center',
      padding: '48px 24px',
      color: 'var(--text-dim)'
    }
  }, hasFilters ? React.createElement('div', null, React.createElement('div', {
    style: {
      fontSize: 16,
      marginBottom: 8
    }
  }, 'No tasks match your current filters.'), React.createElement('button', {
    className: 'btn-primary btn-sm',
    onClick: () => {
      setSearch('');
      setFPri('all');
      setFOwner('all');
      setFCol('all');
    }
  }, 'Clear All Filters')) : React.createElement('div', null, React.createElement('div', {
    style: {
      fontSize: 16,
      marginBottom: 12
    }
  }, 'No tasks yet.'), React.createElement('button', {
    className: 'btn-primary',
    onClick: () => setModal({
      type: 'add',
      task: {}
    })
  }, '+ Add Your First Task'))),
  // Modals
  modal && React.createElement(TaskFormModal, {
    task: modal.task,
    onSave: saveTask,
    onClose: () => setModal(null)
  }), showBin && React.createElement(RecycleBin, {
    deleted,
    onRestore: restoreTask,
    onPermDelete: permDelete,
    onEmptyAll: () => {
      setDeleted(prev => prev.filter(t => now - new Date(t.deletedAt) >= 30 * 86400000));
      showAlert('✓ Recycle Bin emptied.', 'success');
    },
    onClose: () => setShowBin(false)
  }), draftDlg && React.createElement(EmailComposer, {
    toName: draftDlg.task.assignee,
    toEmail: (BOARD.find(b => b.name === draftDlg.task.assignee) || {}).email || '',
    initSubject: draftDlg.subject,
    initBody: draftDlg.body,
    title: 'Task Notification',
    onClose: () => setDraftDlg(null),
    onSent: entry => {
      setSentLog(prev => ({
        ...prev,
        [draftDlg.task.id]: [...(prev[draftDlg.task.id] || []), entry]
      }));
      showAlert('Email client opened for ' + draftDlg.task.assignee + '.', 'success');
      setDraftDlg(null);
    }
  }));
}

function ReEngagePage({
  contacted,
  setContacted,
  memberSentLog,
  setMemberSentLog,
  showAlert
}) {
  const [search, setSearch] = useState('');
  const [fP, setFP] = useState('all');
  const [fS, setFS] = useState('all');
  const [fE, setFE] = useState('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState({});
  const [bulkModal, setBulkModal] = useState(false);
  const [emailDlg, setEmailDlg] = useState(null);
  const [loadingDraft, setLoadingDraft] = useState(false);
  // Bulk flow state
  const [bulkMode, setBulkMode] = useState(null); // null|'pick'|'review'|'sendall'
  const [bulkQueue, setBulkQueue] = useState([]);
  const [bulkIdx, setBulkIdx] = useState(0);
  const [bulkDraft, setBulkDraft] = useState(null);
  const [bulkFrom, setBulkFrom] = useState(NFBPA_EMAILS[0].value);
  const [bulkCustomFrom, setBulkCustomFrom] = useState('');
  const bulkUseCustom = bulkFrom === '__custom__';
  const bulkEffectiveFrom = bulkUseCustom ? bulkCustomFrom : bulkFrom;
  const [bulkProgress, setBulkProgress] = useState({
    done: 0,
    total: 0,
    errors: []
  });
  const [bulkSending, setBulkSending] = useState(false);
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return SUSPENDED_MEMBERS.filter(m => (!q || m.name.toLowerCase().includes(q) || m.email.includes(q)) && (fP === 'all' || m.priority === fP) && (fS === 'all' || m.status === fS) && (fE === 'all' || fE === 'gov' && m.isGov || fE === 'noemail' && m.isNoEmail || fE === 'other' && !m.isGov && !m.isNoEmail));
  }, [search, fP, fS, fE]);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  useEffect(() => setPage(1), [search, fP, fS, fE]);
  const selectedIds = Object.keys(selected).filter(k => selected[k]).map(Number);
  const selectedMembers = SUSPENDED_MEMBERS.filter(m => selectedIds.includes(m.id));
  function toggleSelect(id) {
    setSelected(p => ({
      ...p,
      [id]: !p[id]
    }));
  }
  function selectAll() {
    const ids = {};
    pageData.forEach(m => {
      ids[m.id] = true;
    });
    setSelected(p => ({
      ...p,
      ...ids
    }));
  }
  function clearSelect() {
    setSelected({});
  }
  function toggleContacted(id) {
    setContacted(p => {
      const n = {
        ...p
      };
      if (n[id]) delete n[id];else n[id] = new Date().toLocaleDateString('en-US');
      return n;
    });
  }
  async function openSingleEmail(member) {
    setLoadingDraft(true);
    try {
      const d = await draftMemberEmail(member);
      setEmailDlg({
        member,
        ...d
      });
    } catch {
      showAlert('Could not generate draft.', 'error');
    }
    setLoadingDraft(false);
  }

  // Bulk review: generate draft for current member
  async function loadBulkDraft(member) {
    setBulkDraft(null);
    try {
      const d = await draftMemberEmail(member);
      setBulkDraft(d);
    } catch {
      setBulkDraft({
        subject: 'Error',
        body: 'Could not generate draft.'
      });
    }
  }
  async function startBulk(mode) {
    if (selectedMembers.length === 0) return showAlert('Select at least one member.', 'error');
    setBulkMode(mode);
    setBulkQueue(selectedMembers);
    setBulkIdx(0);
    if (mode === 'review') {
      await loadBulkDraft(selectedMembers[0]);
    }
  }
  async function bulkSendCurrent(m, subject, body) {
    setBulkSending(true);
    try {
      const enc = encodeURIComponent;
      const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(m.email)}&su=${enc(subject)}&body=${enc(body)}`;
      // Open in new tab — direct user gesture from button click
      const a = document.createElement('a');
      a.href = gmailLink;
      a.target = '_blank';
      a.rel = 'noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setMemberSentLog(p => ({
        ...p,
        [m.id]: [...(p[m.id] || []), {
          ts: new Date().toISOString(),
          to: m.email,
          from: bulkEffectiveFrom,
          mode: 'send',
          subject
        }]
      }));
      toggleContacted(m.id);
    } catch (e) {
      setBulkProgress(p => ({
        ...p,
        errors: [...p.errors, { name: m.name, err: e.message }]
      }));
    }
    setBulkSending(false);
  }
  async function doSendAll() {
    setBulkProgress({ done: 0, total: selectedMembers.length, errors: [], links: [] });
    for (let i = 0; i < selectedMembers.length; i++) {
      const m = selectedMembers[i];
      setBulkProgress(p => ({ ...p, done: i }));
      try {
        const d = await draftMemberEmail(m);
        const enc = encodeURIComponent;
        const gmailLink = `https://mail.google.com/mail/?view=cm&to=${enc(m.email)}&su=${enc(d.subject)}&body=${enc(d.body)}`;
        const ml = `mailto:${m.email}?subject=${enc(d.subject)}&body=${enc(d.body)}`;
        setMemberSentLog(p => ({
          ...p,
          [m.id]: [...(p[m.id] || []), {
            ts: new Date().toISOString(),
            to: m.email,
            from: bulkEffectiveFrom,
            mode: 'prepared',
            subject: d.subject,
            gmailLink,
            mailtoLink: ml
          }]
        }));
        toggleContacted(m.id);
        setBulkProgress(p => ({ ...p, links: [...(p.links || []), { name: m.name, email: m.email, gmailLink, mailtoLink: ml }] }));
      } catch (e) {
        setBulkProgress(p => ({
          ...p,
          errors: [...p.errors, { name: m.name, err: e.message }]
        }));
      }
    }
    setBulkProgress(p => ({ ...p, done: selectedMembers.length }));
    setBulkSending(false);
  }
  function exportCSV() {
    const h = 'Last Name,First Name,Email,Mem Expired,Status,Priority,Gov Email,Contacted,Emails Sent';
    const rows = SUSPENDED_MEMBERS.map(m => `"${m.lastName}","${m.firstName}","${m.email}","${m.memExp}","${m.status}","${m.priority}","${m.isGov ? 'Yes' : 'No'}","${contacted[m.id] ? 'Yes' : 'No'}","${(memberSentLog[m.id] || []).length}"`);
    const blob = new Blob([[h, ...rows].join('\n')], {
      type: 'text/csv'
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'nfbpa_suspended_members.csv';
    a.click();
    showAlert('Exported 470 records.', 'success');
  }
  const highCount = SUSPENDED_MEMBERS.filter(m => m.priority === 'High').length;
  const govCount = SUSPENDED_MEMBERS.filter(m => m.isGov).length;
  const contactedCt = Object.keys(contacted).length;
  const expiredCt = SUSPENDED_MEMBERS.filter(m => m.status === 'Expired').length;

  // Render bulk flow modals
  if (bulkMode === 'pick') {
    return /*#__PURE__*/React.createElement(Modal, {
      title: `Bulk Email — ${selectedMembers.length} Members`,
      onClose: () => setBulkMode(null),
      lg: true
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Send From (NFBPA Email)"), /*#__PURE__*/React.createElement("select", {
      className: "form-input",
      value: bulkFrom,
      onChange: e => setBulkFrom(e.target.value)
    }, NFBPA_EMAILS.map(b => /*#__PURE__*/React.createElement("option", {
      key: b.value,
      value: b.value
    }, b.label)), /*#__PURE__*/React.createElement("option", {
      value: "__custom__"
    }, "\u270F Enter external email address\u2026")), bulkUseCustom && /*#__PURE__*/React.createElement("input", {
      className: "form-input",
      style: {
        marginTop: 8
      },
      placeholder: "Enter email address",
      value: bulkCustomFrom,
      onChange: e => setBulkCustomFrom(e.target.value)
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: 'var(--text-mid)',
        marginBottom: 20
      }
    }, "Choose how to process ", /*#__PURE__*/React.createElement("strong", null, selectedMembers.length), " individual emails. Each member receives a personalized draft signed by President Cherrelle Duncan.")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setBulkMode('review');
        loadBulkDraft(selectedMembers[0]);
      },
      style: {
        padding: 20,
        borderRadius: 10,
        border: '2px solid var(--border)',
        background: 'var(--surface2)',
        cursor: 'pointer',
        textAlign: 'left'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 18,
        marginBottom: 8
      }
    }, "\uD83D\uDD0D"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        marginBottom: 4,
        color: 'var(--text)'
      }
    }, "Review Each Draft"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--text-dim)'
      }
    }, "Step through each email one at a time. Edit, then send or save as draft.")), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setBulkMode('sendall');
        doSendAll();
      },
      style: {
        padding: 20,
        borderRadius: 10,
        border: '2px solid var(--border)',
        background: 'var(--surface2)',
        cursor: 'pointer',
        textAlign: 'left'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 18,
        marginBottom: 8
      }
    }, "\u26A1"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        marginBottom: 4,
        color: 'var(--text)'
      }
    }, "Send All at Once"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--text-dim)'
      }
    }, "Generate and send all ", selectedMembers.length, " emails automatically. Progress tracked."))), /*#__PURE__*/React.createElement("div", {
      className: "form-actions"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost",
      onClick: () => setBulkMode(null)
    }, "Cancel")));
  }
  if (bulkMode === 'sendall') {
    const pct = bulkProgress.total > 0 ? Math.round(bulkProgress.done / bulkProgress.total * 100) : 0;
    const done = bulkProgress.done >= bulkProgress.total && bulkProgress.total > 0;
    const links = bulkProgress.links || [];
    return /*#__PURE__*/React.createElement(Modal, {
      title: done ? '\u2709 Emails Ready to Send' : 'Preparing Emails\u2026',
      onClose: done ? () => { setBulkMode(null); clearSelect(); } : undefined,
      lg: true
    }, /*#__PURE__*/React.createElement("div", { style: { textAlign: 'center', padding: '12px 0' } },
      /*#__PURE__*/React.createElement("div", {
        style: { fontSize: 28, fontFamily: "'Bebas Neue',sans-serif", color: 'var(--teal)', marginBottom: 8 }
      }, bulkProgress.done, " / ", bulkProgress.total),
      /*#__PURE__*/React.createElement("div", { className: "bulk-progress" },
        /*#__PURE__*/React.createElement("div", { className: "bulk-progress-fill", style: { width: pct + '%' } })
      ),
      /*#__PURE__*/React.createElement("div", { style: { fontSize: 12, color: 'var(--text-dim)', marginTop: 8 } },
        done ? 'All drafts ready. Click each name below to open in your email client.' : 'Preparing drafts — please wait\u2026'
      ),
      bulkProgress.errors.length > 0 && /*#__PURE__*/React.createElement("div", {
        style: { marginTop: 10, fontSize: 11, color: 'var(--red)' }
      }, bulkProgress.errors.length, " error(s): ", bulkProgress.errors.map(e => e.name).join(', '))
    ),
    done && links.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: { maxHeight: 320, overflowY: 'auto', margin: '12px 0', border: '1px solid var(--border)', borderRadius: 8 }
    }, links.map((l, i) => /*#__PURE__*/React.createElement("a", {
      key: i,
      href: l.gmailLink,
      target: '_blank',
      rel: 'noreferrer',
      style: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '11px 16px', borderBottom: i < links.length-1 ? '1px solid var(--border)' : 'none',
        textDecoration: 'none', color: 'var(--text)', fontSize: 13,
        background: 'var(--surface2)', cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, l.name),
      /*#__PURE__*/React.createElement("span", { style: { fontSize: 11, color: 'var(--text-dim)', marginLeft: 10, fontFamily: "'DM Mono',monospace" } }, l.email)
    ), /*#__PURE__*/React.createElement("span", {
      style: { fontSize: 11, color: '#EA4335', fontWeight: 600 }
    }, '✉ Gmail →')))),
    done && /*#__PURE__*/React.createElement("div", { style: { fontSize: 11, color: 'var(--text-dim)', marginTop: 8, marginBottom: 12 } },
      'Click each row to open in your default email client. All members have been marked as contacted.'
    ),
    done && /*#__PURE__*/React.createElement("div", { className: "form-actions" },
      /*#__PURE__*/React.createElement("button", {
        className: "btn-primary",
        onClick: () => { setBulkMode(null); clearSelect(); }
      }, "Done")
    ));
  }
  if (bulkMode === 'review' && bulkQueue.length > 0) {
    const cur = bulkQueue[bulkIdx];
    const isLast = bulkIdx === bulkQueue.length - 1;
    return /*#__PURE__*/React.createElement(Modal, {
      title: `Review Draft ${bulkIdx + 1} of ${bulkQueue.length}`,
      onClose: () => setBulkMode(null),
      lg: true
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginBottom: 14,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "badge badge-dim"
    }, "To: ", cur.name), /*#__PURE__*/React.createElement("span", {
      className: "badge badge-dim",
      style: {
        fontSize: 9,
        fontFamily: "'DM Mono',monospace"
      }
    }, cur.email), /*#__PURE__*/React.createElement("span", {
      className: `badge ${cur.priority === 'High' ? 'badge-red' : cur.priority === 'Medium' ? 'badge-gold' : 'badge-dim'}`
    }, cur.priority)), /*#__PURE__*/React.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "From"), /*#__PURE__*/React.createElement("select", {
      className: "form-input",
      value: bulkFrom,
      onChange: e => setBulkFrom(e.target.value)
    }, NFBPA_EMAILS.map(b => /*#__PURE__*/React.createElement("option", {
      key: b.value,
      value: b.value
    }, b.label)))), !bulkDraft ? /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        padding: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "dot-loader"
    }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null))) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Subject"), /*#__PURE__*/React.createElement("input", {
      className: "form-input",
      value: bulkDraft.subject,
      onChange: e => setBulkDraft(p => ({
        ...p,
        subject: e.target.value
      }))
    })), /*#__PURE__*/React.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Body"), /*#__PURE__*/React.createElement("textarea", {
      className: "form-input form-textarea",
      value: bulkDraft.body,
      onChange: e => setBulkDraft(p => ({
        ...p,
        body: e.target.value
      }))
    })))), /*#__PURE__*/React.createElement("div", {
      className: "form-actions"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost",
      onClick: () => setBulkMode(null)
    }, "Exit"), bulkDraft && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost",
      disabled: bulkSending,
      onClick: async () => {
        await bulkSendCurrent(cur, bulkDraft.subject, bulkDraft.body);
        if (!isLast) {
          setBulkIdx(i => i + 1);
          await loadBulkDraft(bulkQueue[bulkIdx + 1]);
        } else {
          setBulkMode(null);
          clearSelect();
          showAlert(`${bulkQueue.length} emails sent.`, 'success');
        }
      }
    }, bulkSending ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "sending-spinner"
    }), " Sending\u2026") : /*#__PURE__*/React.createElement(React.Fragment, null, "\u2709 Send & ", isLast ? 'Finish' : 'Next')), /*#__PURE__*/React.createElement("button", {
      className: "btn-primary",
      disabled: bulkSending,
      onClick: async () => {
        if (!isLast) {
          setBulkIdx(i => i + 1);
          await loadBulkDraft(bulkQueue[bulkIdx + 1]);
        } else {
          setBulkMode(null);
          clearSelect();
        }
      }
    }, "Skip \u2192"))));
  }
  return /*#__PURE__*/React.createElement("div", null, loadingDraft && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,.4)',
      zIndex: 900,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      borderRadius: 12,
      padding: 32,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dot-loader"
  }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      color: 'var(--text-mid)',
      fontSize: 13
    }
  }, "Generating draft\u2026"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 16px',
      background: 'var(--gold-soft)',
      border: '1px solid rgba(154,116,40,.2)',
      borderRadius: 8,
      marginBottom: 18,
      fontSize: 12,
      color: 'var(--gold)'
    }
  }, "470 suspended and expired members \u2014 your highest-value asset for reaching the 500-member post-Anniversary target. Select members to bulk email. GOV badges indicate directly reachable work emails."), /*#__PURE__*/React.createElement("div", {
    className: "grid-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi red"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "High Priority"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-value red"
  }, highCount), /*#__PURE__*/React.createElement("div", {
    className: "kpi-sub"
  }, "Gov email + recent lapse")), /*#__PURE__*/React.createElement("div", {
    className: "kpi blue"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Gov Emails"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-value blue"
  }, govCount), /*#__PURE__*/React.createElement("div", {
    className: "kpi-sub"
  }, "Reachable at work")), /*#__PURE__*/React.createElement("div", {
    className: "kpi gold"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Expired Recently"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-value gold"
  }, expiredCt), /*#__PURE__*/React.createElement("div", {
    className: "kpi-sub"
  }, "Warmest leads")), /*#__PURE__*/React.createElement("div", {
    className: "kpi teal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Contacted"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-value teal"
  }, contactedCt), /*#__PURE__*/React.createElement("div", {
    className: "kpi-sub"
  }, "of ", SUSPENDED_MEMBERS.length, " members"), /*#__PURE__*/React.createElement("div", {
    className: "progress-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "progress-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "progress-fill teal",
    style: {
      width: Math.min(100, Math.round(contactedCt / SUSPENDED_MEMBERS.length * 100)) + '%'
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "toolbar"
  }, /*#__PURE__*/React.createElement("input", {
    className: "search-input",
    placeholder: "Search name or email\u2026",
    value: search,
    onChange: e => setSearch(e.target.value)
  }), /*#__PURE__*/React.createElement("select", {
    className: "filter-select",
    value: fP,
    onChange: e => setFP(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "All Priority"), /*#__PURE__*/React.createElement("option", null, "High"), /*#__PURE__*/React.createElement("option", null, "Medium"), /*#__PURE__*/React.createElement("option", null, "Low")), /*#__PURE__*/React.createElement("select", {
    className: "filter-select",
    value: fS,
    onChange: e => setFS(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "All Status"), /*#__PURE__*/React.createElement("option", null, "Suspended"), /*#__PURE__*/React.createElement("option", null, "Expired")), /*#__PURE__*/React.createElement("select", {
    className: "filter-select",
    value: fE,
    onChange: e => setFE(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "All Emails"), /*#__PURE__*/React.createElement("option", {
    value: "gov"
  }, "Gov"), /*#__PURE__*/React.createElement("option", {
    value: "other"
  }, "Non-gov"), /*#__PURE__*/React.createElement("option", {
    value: "noemail"
  }, "No Email")), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-sm",
    onClick: exportCSV
  }, "\u2193 CSV")), selectedIds.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      padding: '10px 14px',
      background: 'var(--blue-soft)',
      border: '1px solid rgba(31,111,168,.2)',
      borderRadius: 8,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--blue)'
    }
  }, selectedIds.length, " selected"), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary btn-sm",
    onClick: () => setBulkMode('pick')
  }, "\u2709 Bulk Email Selected"), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-sm",
    onClick: clearSelect
  }, "Clear")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-dim)'
    }
  }, filtered.length, " members \u2014 page ", page, " of ", totalPages), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-sm",
    onClick: selectAll
  }, "Select Page")), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 0,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "data-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "checkbox-cell"
  }), /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Email"), /*#__PURE__*/React.createElement("th", null, "Expired"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Priority"), /*#__PURE__*/React.createElement("th", null, "Emails"), /*#__PURE__*/React.createElement("th", null, "Outreach"))), /*#__PURE__*/React.createElement("tbody", null, pageData.length === 0 && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 8,
    style: {
      textAlign: 'center',
      color: 'var(--text-dim)',
      padding: 32
    }
  }, "No members match filters.")), pageData.map(m => {
    const logs = memberSentLog[m.id] || [];
    return /*#__PURE__*/React.createElement("tr", {
      key: m.id,
      className: contacted[m.id] ? 'contacted-row' : ''
    }, /*#__PURE__*/React.createElement("td", {
      className: "checkbox-cell"
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: !!selected[m.id],
      onChange: () => toggleSelect(m.id)
    })), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 500
      }
    }, m.name, m.isGov && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 6,
        fontSize: 9,
        color: 'var(--teal)',
        fontWeight: 700,
        verticalAlign: 'middle'
      }
    }, "GOV")), /*#__PURE__*/React.createElement("td", {
      style: {
        fontFamily: "'DM Mono',monospace",
        fontSize: 11,
        color: m.isNoEmail ? 'var(--text-dim)' : m.isGov ? 'var(--teal)' : 'var(--text-mid)'
      }
    }, m.email), /*#__PURE__*/React.createElement("td", {
      style: {
        fontFamily: "'DM Mono',monospace",
        fontSize: 11,
        color: 'var(--text-dim)'
      }
    }, m.memExp), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: `badge ${m.status === 'Expired' ? 'badge-gold' : 'badge-dim'}`
    }, m.status)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: priColor(m.priority)
      }
    }, m.priority)), /*#__PURE__*/React.createElement("td", null, logs.length > 0 ? /*#__PURE__*/React.createElement("span", {
      className: "badge badge-sent"
    }, "\u2713 ", logs.length) : /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: 'var(--text-dim)'
      }
    }, "\u2014")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 5
      }
    }, !m.isNoEmail && /*#__PURE__*/React.createElement("button", {
      className: "btn-teal",
      style: {
        fontSize: 10
      },
      onClick: () => openSingleEmail(m)
    }, "\u2709 Draft"), contacted[m.id] ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: 'var(--teal)',
        fontWeight: 600
      }
    }, "\u2713 Done ", /*#__PURE__*/React.createElement("button", {
      style: {
        fontSize: 9,
        color: 'var(--text-dim)',
        cursor: 'pointer'
      },
      onClick: () => toggleContacted(m.id)
    }, "undo")) : /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost btn-sm",
      style: {
        fontSize: 10
      },
      onClick: () => {
        toggleContacted(m.id);
        showAlert(`${m.name} marked contacted.`, 'success');
      }
    }, "Mark Contacted"))));
  })))), totalPages > 1 && /*#__PURE__*/React.createElement("div", {
    className: "pager"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pager-btn",
    onClick: () => setPage(p => Math.max(1, p - 1)),
    disabled: page === 1
  }, "\u2039"), Array.from({
    length: Math.min(totalPages, 7)
  }, (_, i) => {
    let pg = page <= 4 ? i + 1 : page >= totalPages - 3 ? totalPages - 6 + i : page - 3 + i;
    if (totalPages <= 7) pg = i + 1;
    return /*#__PURE__*/React.createElement("button", {
      key: pg,
      className: `pager-btn${page === pg ? ' active' : ''}`,
      onClick: () => setPage(pg)
    }, pg);
  }).filter((_, i, a) => a[i]), /*#__PURE__*/React.createElement("button", {
    className: "pager-btn",
    onClick: () => setPage(p => Math.min(totalPages, p + 1)),
    disabled: page === totalPages
  }, "\u203A"), /*#__PURE__*/React.createElement("span", {
    className: "pager-info"
  }, "Page ", page, " of ", totalPages)), emailDlg && /*#__PURE__*/React.createElement(EmailComposer, {
    toName: emailDlg.member.name,
    toEmail: emailDlg.member.email,
    initSubject: emailDlg.subject,
    initBody: emailDlg.body,
    title: "Member Re-engagement Email",
    onClose: () => setEmailDlg(null),
    onSent: entry => {
      setMemberSentLog(p => ({
        ...p,
        [emailDlg.member.id]: [...(p[emailDlg.member.id] || []), entry]
      }));
      toggleContacted(emailDlg.member.id);
      showAlert(`Email client opened for ${emailDlg.member.name}.`, 'success');
      setEmailDlg(null);
    }
  }));
}

// ── ACTUALS PAGE ──────────────────────────────────────────────────────────────
function ActualsPage({
  actuals,
  setActuals
}) {
  const set = (n, v) => setActuals(p => ({
    ...p,
    [n]: parseFloat(v) || 0
  }));
  const totalTgt = CHANNELS_12.reduce((s, c) => s + c.target, 0);
  const totalAct = CHANNELS_12.reduce((s, c) => s + (actuals[c.name] || 0), 0);
  const pct = Math.round(totalAct / totalTgt * 100);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "grid-3",
    style: {
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi gold"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "FY 2026 Target"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-value gold"
  }, fmtCurr(totalTgt)), /*#__PURE__*/React.createElement("div", {
    className: "kpi-sub"
  }, "12 channels")), /*#__PURE__*/React.createElement("div", {
    className: "kpi teal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Actuals to Date"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-value teal"
  }, fmtCurr(totalAct)), /*#__PURE__*/React.createElement("div", {
    className: "progress-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "progress-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "progress-fill teal",
    style: {
      width: Math.min(100, pct) + '%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: 'var(--text-dim)',
      marginTop: 4
    }
  }, pct, "% of target"))), /*#__PURE__*/React.createElement("div", {
    className: "kpi blue"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Gap to Close"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-value blue"
  }, fmtCurr(Math.max(0, totalTgt - totalAct))), /*#__PURE__*/React.createElement("div", {
    className: "kpi-sub"
  }, "Remaining to target"))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 0,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 20px',
      borderBottom: '1px solid var(--border)',
      fontSize: 11,
      color: 'var(--text-dim)'
    }
  }, "Enter actual revenue received per channel. All edits persist automatically."), /*#__PURE__*/React.createElement("table", {
    className: "data-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Channel"), /*#__PURE__*/React.createElement("th", null, "Category"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right'
    }
  }, "Target"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right'
    }
  }, "Actual"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right'
    }
  }, "Variance"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right'
    }
  }, "Complete"))), /*#__PURE__*/React.createElement("tbody", null, CHANNELS_12.map((c, i) => {
    const a = actuals[c.name] || 0;
    const v = a - c.target;
    const p = c.target > 0 ? Math.round(a / c.target * 100) : 0;
    return /*#__PURE__*/React.createElement("tr", {
      key: i
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 500
      }
    }, c.name), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "badge badge-dim"
    }, c.category)), /*#__PURE__*/React.createElement("td", {
      style: {
        textAlign: 'right',
        fontFamily: "'DM Mono',monospace",
        fontSize: 12,
        color: 'var(--gold)'
      }
    }, fmtCurr(c.target)), /*#__PURE__*/React.createElement("td", {
      style: {
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement("input", {
      className: "actual-input",
      type: "number",
      value: a || '',
      placeholder: "0",
      onChange: e => set(c.name, e.target.value)
    })), /*#__PURE__*/React.createElement("td", {
      style: {
        textAlign: 'right',
        fontFamily: "'DM Mono',monospace",
        fontSize: 12,
        color: v >= 0 ? 'var(--teal)' : 'var(--red)'
      }
    }, v >= 0 ? '+' : '', fmtCurr(v)), /*#__PURE__*/React.createElement("td", {
      style: {
        textAlign: 'right',
        fontSize: 12,
        color: p >= 100 ? 'var(--teal)' : p >= 50 ? 'var(--gold)' : 'var(--red)'
      }
    }, p, "%"));
  }), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 2,
    style: {
      fontWeight: 700
    }
  }, "TOTAL"), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: 'right',
      fontFamily: "'DM Mono',monospace",
      fontWeight: 700,
      color: 'var(--gold)'
    }
  }, fmtCurr(totalTgt)), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: 'right',
      fontFamily: "'DM Mono',monospace",
      fontWeight: 700,
      color: 'var(--teal)'
    }
  }, fmtCurr(totalAct)), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: 'right',
      fontFamily: "'DM Mono',monospace",
      fontWeight: 700,
      color: totalAct >= totalTgt ? 'var(--teal)' : 'var(--red)'
    }
  }, totalAct - totalTgt >= 0 ? '+' : '', fmtCurr(totalAct - totalTgt)), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: 'right',
      fontWeight: 700,
      color: pct >= 100 ? 'var(--teal)' : 'var(--gold)'
    }
  }, pct, "%"))))));
}

// ── SPONSORS ──────────────────────────────────────────────────────────────────
function SponsorsPage({
  sponsors,
  setSponsors,
  showAlert
}) {
  const [search, setSearch] = useState('');
  const [fStat, setFStat] = useState('all');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [delId, setDelId] = useState(null);
  const filtered = useMemo(() => sponsors.filter(s => {
    const q = search.toLowerCase();
    return (!q || s.name.toLowerCase().includes(q)) && (fStat === 'all' || s.status === fStat);
  }), [sponsors, search, fStat]);
  const total = filtered.reduce((s, x) => s + Number(x.amount), 0);
  function save() {
    if (!form.name?.trim()) return showAlert('Organization name required.', 'error');
    if (modal === 'add') {
      setSponsors(p => [...p, {
        ...form,
        id: Date.now(),
        amount: Number(form.amount || 0)
      }]);
      showAlert('Sponsor added.', 'success');
    } else {
      setSponsors(p => p.map(s => s.id === form.id ? {
        ...form,
        amount: Number(form.amount || 0)
      } : s));
      showAlert('Updated.', 'success');
    }
    setModal(null);
  }
  function del(id) {
    setSponsors(p => p.filter(s => s.id !== id));
    setDelId(null);
    showAlert('Removed.', 'success');
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 14px',
      background: 'var(--gold-soft)',
      border: '1px solid rgba(154,116,40,.2)',
      borderRadius: 8,
      marginBottom: 16,
      fontSize: 12,
      color: 'var(--gold)'
    }
  }, "\u26A0 All conversations require President Cherrelle Duncan's direct involvement. Dr. Kimberly Henderson coordinates proposal delivery."), /*#__PURE__*/React.createElement("div", {
    className: "toolbar"
  }, /*#__PURE__*/React.createElement("input", {
    className: "search-input",
    placeholder: "Search sponsors\u2026",
    value: search,
    onChange: e => setSearch(e.target.value)
  }), /*#__PURE__*/React.createElement("select", {
    className: "filter-select",
    value: fStat,
    onChange: e => setFStat(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "All Status"), SPONSOR_STATUS.map(s => /*#__PURE__*/React.createElement("option", {
    key: s
  }, s))), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary btn-sm",
    onClick: () => {
      setForm({
        name: '',
        amount: '',
        status: 'Negotiating',
        contact: '',
        note: ''
      });
      setModal('add');
    }
  }, "+ Add Sponsor")), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 0,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "data-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Organization"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right'
    }
  }, "Amount"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Contact"), /*#__PURE__*/React.createElement("th", null, "Notes"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, filtered.length === 0 && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 6,
    style: {
      textAlign: 'center',
      color: 'var(--text-dim)',
      padding: 32
    }
  }, "No sponsors found.")), filtered.map(s => /*#__PURE__*/React.createElement("tr", {
    key: s.id
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      fontWeight: 600
    }
  }, s.name), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: 'right',
      fontFamily: "'DM Mono',monospace",
      color: 'var(--gold)',
      fontWeight: 600
    }
  }, fmtCurr(s.amount)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: `badge ${statusColor(s.status)}`
  }, s.status)), /*#__PURE__*/React.createElement("td", {
    style: {
      fontSize: 12,
      color: 'var(--text-mid)'
    }
  }, s.contact), /*#__PURE__*/React.createElement("td", {
    style: {
      fontSize: 11,
      color: 'var(--text-dim)',
      maxWidth: 200
    }
  }, s.note), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-sm",
    onClick: () => {
      setForm({
        ...s
      });
      setModal('edit');
    }
  }, "Edit"), /*#__PURE__*/React.createElement("button", {
    className: "btn-danger btn-sm",
    onClick: () => setDelId(s.id)
  }, "Del"))))), filtered.length > 0 && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      fontWeight: 700
    }
  }, "PIPELINE TOTAL"), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: 'right',
      fontFamily: "'DM Mono',monospace",
      color: 'var(--gold)',
      fontWeight: 700
    }
  }, fmtCurr(total)), /*#__PURE__*/React.createElement("td", {
    colSpan: 4
  }))))), modal && /*#__PURE__*/React.createElement(Modal, {
    title: modal === 'add' ? 'Add Sponsor' : 'Edit Sponsor',
    onClose: () => setModal(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Organization *"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    value: form.name || '',
    onChange: e => setForm(p => ({
      ...p,
      name: e.target.value
    }))
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Amount ($)"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "number",
    value: form.amount || '',
    onChange: e => setForm(p => ({
      ...p,
      amount: e.target.value
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Status"), /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    value: form.status || 'Negotiating',
    onChange: e => setForm(p => ({
      ...p,
      status: e.target.value
    }))
  }, SPONSOR_STATUS.map(o => /*#__PURE__*/React.createElement("option", {
    key: o
  }, o))))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Point of Contact"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    value: form.contact || '',
    onChange: e => setForm(p => ({
      ...p,
      contact: e.target.value
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Notes"), /*#__PURE__*/React.createElement("textarea", {
    className: "form-input",
    rows: 3,
    value: form.note || '',
    onChange: e => setForm(p => ({
      ...p,
      note: e.target.value
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost",
    onClick: () => setModal(null)
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary",
    onClick: save
  }, "Save Sponsor"))), delId && /*#__PURE__*/React.createElement(Modal, {
    title: "Confirm",
    onClose: () => setDelId(null)
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--text-mid)',
      marginBottom: 20
    }
  }, "Remove this sponsor?"), /*#__PURE__*/React.createElement("div", {
    className: "form-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost",
    onClick: () => setDelId(null)
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn-danger",
    onClick: () => del(delId)
  }, "Remove"))));
}

// ── ORG PAGE ──────────────────────────────────────────────────────────────────
const PAST_PRESIDENTS = [{
  years: '1986–1987',
  name: 'Major Brock'
}, {
  years: '1988–1989',
  name: 'Mary Ann Donatto'
}, {
  years: '1989–1992',
  name: 'Yvette Chargois',
  note: '*deceased'
}, {
  years: '1992–1996',
  name: 'Joyce J. Bethany'
}, {
  years: '1996–1998',
  name: 'Naomi S. Hines'
}, {
  years: '1998–2000',
  name: 'Lenoria Walker'
}, {
  years: '2000–2002',
  name: 'Keith Bynam'
}, {
  years: '2003–2006',
  name: 'Bonita H. Cade'
}, {
  years: '2007–2010',
  name: 'Toni M. Lewis'
}, {
  years: '2011–2014',
  name: 'Jeana L. Nellons'
}, {
  years: '2015–2016',
  name: 'Michael Moore'
}, {
  years: '2017–2018',
  name: 'Nicole Holland'
}, {
  years: '2019–2020',
  name: 'Melinda Alfred'
}, {
  years: '2021–2022',
  name: 'Charlene Amboree'
}, {
  years: '2023–2024',
  name: 'Brandon Denton'
}, {
  years: '2024–present',
  name: 'Cherrelle J. Duncan',
  current: true
}];
const PROGRAMMING_2026 = [{
  q: 'Q1',
  label: 'Q1 2026',
  events: [{
    name: "President's Brunch",
    date: 'Feb 21, 2026',
    status: 'Completed'
  }, {
    name: 'GBM / Mobility Program',
    date: 'Feb 4, 2026',
    status: 'Completed'
  }, {
    name: 'FORUM (National)',
    date: 'Mar 7–12, 2026',
    status: 'Completed'
  }]
}, {
  q: 'Q2',
  label: 'Q2 2026 — Anniversary Month',
  events: [{
    name: 'GBM: Cross-Racial Collaboration',
    date: 'Apr 23, 2026',
    status: 'Completed'
  }, {
    name: 'Membership Mixer',
    date: 'May 14, 2026',
    status: 'Completed'
  }, {
    name: 'Proclamations: 40th Anniversary (City, County, Congressional)',
    date: 'Jun 2026',
    status: 'Upcoming'
  }, {
    name: '40th Anniversary Mixer',
    date: 'Jun 5, 2026',
    status: 'Upcoming'
  }, {
    name: 'Public Administration Day',
    date: 'Jun 6, 2026',
    status: 'Upcoming'
  }, {
    name: '40th Scholarship & Awards Luncheon',
    date: 'Jun 7, 2026',
    status: 'Upcoming'
  }]
}, {
  q: 'Q3',
  label: 'Q3 2026',
  events: [{
    name: 'Dine & Dialogue',
    date: 'TBD',
    status: 'Planned'
  }, {
    name: 'Legacy Leadership Roundtable (Collegiate Event)',
    date: 'Aug 27, 2026',
    status: 'Planned'
  }]
}, {
  q: 'Q4',
  label: 'Q4 2026',
  events: [{
    name: 'Year End Holiday BPA',
    date: 'Dec 2026',
    status: 'Planned'
  }]
}];
const GOALS_2026 = [{
  icon: '◎',
  text: 'Increase membership to 250 individuals'
}, {
  icon: '◆',
  text: 'Raise $25,000 with $5,000 designated for scholarships'
}, {
  icon: '◉',
  text: 'Provide access to opportunities and support services (Forum support, job opportunities, wellness checks, benevolence)'
}, {
  icon: '◈',
  text: 'Display the good work of members and board through storytelling online and in print'
}];
function OrgPage() {
  const row = (label, value) => React.createElement('div', {
    className: 'info-row'
  }, React.createElement('div', {
    className: 'info-label'
  }, label), React.createElement('div', {
    className: 'info-value'
  }, value));
  function evtColor(s) {
    if (s === 'Completed') return 'badge-teal';
    if (s === 'Upcoming') return 'badge-gold';
    return 'badge-dim';
  }
  return React.createElement('div', null,
  // Mission card
  React.createElement('div', {
    className: 'card',
    style: {
      marginBottom: 20
    }
  }, React.createElement('div', {
    className: 'card-title'
  }, 'Mission'), React.createElement('div', {
    style: {
      fontSize: 14,
      color: 'var(--text-mid)',
      lineHeight: 1.8,
      borderLeft: '3px solid var(--gold)',
      paddingLeft: 16
    }
  }, 'Our mission is to serve as a catalyst for linking public and private organizations, as well as academic institutions to support the professional development of individuals choosing public service careers.', React.createElement('br', null), React.createElement('br', null), 'We are the premier organization focused on excellence in public administration, leadership, management, and professional development.', React.createElement('br', null), React.createElement('br', null), 'With these skills and knowledge, we are able to provide leadership in public policy, housing, economic development, infrastructure, community development, public safety, public health, and financial management, in the communities we serve.')),
  // 2026 Goals
  React.createElement('div', {
    className: 'card',
    style: {
      marginBottom: 20
    }
  }, React.createElement('div', {
    className: 'card-title'
  }, '2026 Goals'), React.createElement('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 14
    }
  }, GOALS_2026.map((g, i) => React.createElement('div', {
    key: i,
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start',
      padding: 16,
      background: 'var(--surface2)',
      border: '1px solid var(--border)',
      borderRadius: 10
    }
  }, React.createElement('span', {
    style: {
      fontSize: 22,
      color: 'var(--gold)',
      flexShrink: 0
    }
  }, g.icon), React.createElement('div', {
    style: {
      fontSize: 13,
      color: 'var(--text-mid)',
      lineHeight: 1.6
    }
  }, g.text))))),
  // 2026 Programming
  React.createElement('div', {
    className: 'card',
    style: {
      marginBottom: 20
    }
  }, React.createElement('div', {
    className: 'card-title'
  }, '2026 Programming Calendar'), React.createElement('div', {
    style: {
      fontSize: 10,
      color: 'var(--text-dim)',
      marginBottom: 14
    }
  }, '*Subject to change'), PROGRAMMING_2026.map(q => React.createElement('div', {
    key: q.q,
    style: {
      marginBottom: 20
    }
  }, React.createElement('div', {
    style: {
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: 'var(--navy)',
      marginBottom: 10,
      paddingBottom: 6,
      borderBottom: '2px solid var(--gold)'
    }
  }, q.label), React.createElement('div', null, q.events.map((e, i) => React.createElement('div', {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: '1px solid var(--border)'
    }
  }, React.createElement('div', null, React.createElement('div', {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: 'var(--text)'
    }
  }, e.name), React.createElement('div', {
    style: {
      fontSize: 11,
      color: 'var(--text-dim)',
      marginTop: 2,
      fontFamily: "'DM Mono',monospace"
    }
  }, e.date)), React.createElement('span', {
    className: 'badge ' + evtColor(e.status)
  }, e.status))))))),
  // Tax / Legal / Contact
  React.createElement('div', {
    className: 'grid-2',
    style: {
      marginBottom: 20
    }
  }, React.createElement('div', {
    className: 'card'
  }, React.createElement('div', {
    className: 'card-title'
  }, 'Tax & Legal Status'), row('EIN', React.createElement('span', {
    style: {
      fontFamily: "'DM Mono',monospace"
    }
  }, '59-2364093')), row('Tax Status', React.createElement('span', {
    className: 'badge badge-teal'
  }, '501(c)(3) Tax-Exempt')), row('Tax Classification', 'C Corporation'), row('Foundation Status', 'Not a Private Foundation — 509(a)(1) / 170(b)(1)(A)(vi)'), row('Deductibility', 'Tax-deductible under IRC Section 170'), row('IRS Determination', 'December 1984 — reconfirmed October 2012')), React.createElement('div', {
    className: 'card'
  }, React.createElement('div', {
    className: 'card-title'
  }, 'Contact & Operations'), row('Chartered', 'June 6, 1986'), row('Address', 'PO Box 301092, Houston, TX 77230-1092'), row('Phone', React.createElement('span', {
    style: {
      fontFamily: "'DM Mono',monospace"
    }
  }, '832.395.2141')), row('Website', React.createElement('a', {
    href: 'https://www.nfbpahoustontx.org',
    target: '_blank',
    style: {
      color: 'var(--gold)',
      fontFamily: "'DM Mono',monospace",
      fontSize: 12
    }
  }, 'www.nfbpahoustontx.org')), row('Fundraising Goal FY26', React.createElement('span', {
    style: {
      color: 'var(--gold)',
      fontWeight: 700
    }
  }, '$25,000')), row('Scholarship Goal FY26', React.createElement('span', {
    style: {
      color: 'var(--teal)',
      fontWeight: 700
    }
  }, '$5,000')), row('Membership Goal 2026', '250 individual members'), row('40th Anniversary', React.createElement('span', {
    style: {
      fontFamily: "'DM Mono',monospace"
    }
  }, 'June 5–7, 2026')))),
  // Past Presidents
  React.createElement('div', {
    className: 'card'
  }, React.createElement('div', {
    className: 'card-title'
  }, 'Presidential History — NFBPA Greater Houston Chapter'), React.createElement('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))',
      gap: 10
    }
  }, PAST_PRESIDENTS.map((p, i) => React.createElement('div', {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 14px',
      background: p.current ? 'var(--gold-soft)' : 'var(--surface2)',
      border: p.current ? '1px solid rgba(154,116,40,.3)' : '1px solid var(--border)',
      borderRadius: 8
    }
  }, React.createElement('div', {
    style: {
      width: 32,
      height: 32,
      borderRadius: '50%',
      flexShrink: 0,
      background: p.current ? 'var(--gold)' : 'var(--surface)',
      border: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 10,
      fontWeight: 700,
      color: p.current ? '#fff' : 'var(--text-dim)'
    }
  }, p.current ? '★' : String(PAST_PRESIDENTS.length - i).padStart(2, '0')), React.createElement('div', null, React.createElement('div', {
    style: {
      fontSize: 13,
      fontWeight: p.current ? 700 : 500,
      color: p.current ? 'var(--gold)' : 'var(--text)'
    }
  }, p.name, p.note && React.createElement('span', {
    style: {
      fontSize: 10,
      color: 'var(--text-dim)',
      marginLeft: 4
    }
  }, p.note)), React.createElement('div', {
    style: {
      fontSize: 10,
      color: 'var(--text-dim)',
      fontFamily: "'DM Mono',monospace",
      marginTop: 1
    }
  }, p.years)))))));
}

const TABS = [{
  id: 'overview',
  label: 'Overview',
  icon: '◈'
}, {
  id: 'board',
  label: 'Board',
  icon: '◉'
}, {
  id: 'tasks',
  label: 'Tasks',
  icon: '◧'
}, {
  id: 'members',
  label: 'Members',
  icon: '◍'
}, {
  id: 'reengage',
  label: 'Re-engage',
  icon: '↺',
  badge: '470'
}, {
  id: 'actuals',
  label: 'Actuals',
  icon: '◎'
}, {
  id: 'sponsors',
  label: 'Sponsors',
  icon: '◆'
}, {
  id: 'org',
  label: 'Organization',
  icon: '◫'
}];
const TITLES = {
  overview: 'Overview',
  board: 'Board of Directors',
  tasks: 'Task Tracker',
  members: 'Member Roster',
  reengage: 'Member Re-engagement',
  actuals: 'Revenue Actuals',
  sponsors: 'Sponsor Pipeline',
  org: 'Organization'
};
function MembersPage({
  showAlert
}) {
  const [search, setSearch] = React.useState('');
  const [fType, setFType] = React.useState('all');
  const [fTab, setFTab] = React.useState('all');
  const [page, setPage] = React.useState(1);
  const PAGE_SZ = 20;
  const memberTypes = [...new Set(CURRENT_MEMBERS.map(m => m.memberType))].sort();
  const sourceTabs = [...new Set(CURRENT_MEMBERS.map(m => m.sourceTab))].sort();
  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    return CURRENT_MEMBERS.filter(m => (!q || m.name.toLowerCase().includes(q) || m.email.includes(q) || m.org.toLowerCase().includes(q) || m.title.toLowerCase().includes(q)) && (fType === 'all' || m.memberType === fType) && (fTab === 'all' || m.sourceTab === fTab));
  }, [search, fType, fTab]);
  const totalPages = Math.ceil(filtered.length / PAGE_SZ);
  const pageData = filtered.slice((page - 1) * PAGE_SZ, page * PAGE_SZ);
  React.useEffect(() => setPage(1), [search, fType, fTab]);
  const indvCount = CURRENT_MEMBERS.filter(m => m.memberType === 'Individual Member').length;
  const corpCount = CURRENT_MEMBERS.filter(m => m.memberType.startsWith('Corporate')).length;
  const studCount = CURRENT_MEMBERS.filter(m => m.memberType === 'Student Member').length;
  const retCount = CURRENT_MEMBERS.filter(m => m.memberType === 'Retiree Member').length;
  function typeColor(t) {
    if (t.startsWith('Corporate')) return 'badge-gold';
    if (t === 'Student Member') return 'badge-blue';
    if (t === 'Retiree Member') return 'badge-teal';
    return 'badge-dim';
  }
  function typeShort(t) {
    if (t.startsWith('Corporate Member (up')) return 'Corporate ≤250';
    if (t.startsWith('Corporate Member (over')) return 'Corporate 500+';
    return t;
  }
  function exportCSV() {
    const h = 'Name,Organization,Title,Member Type,Member Since,Expiration,Email,Phone,Recruited By';
    const rows = CURRENT_MEMBERS.map(m => `"${m.name}","${m.org}","${m.title}","${m.memberType}","${m.since}","${m.expiration}","${m.email}","${m.phone}","${m.sourceTab}"`);
    const blob = new Blob([[h, ...rows].join('\n')], {
      type: 'text/csv'
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'nfbpa_current_members.csv';
    a.click();
    showAlert('Exported ' + CURRENT_MEMBERS.length + ' members.', 'success');
  }
  return React.createElement('div', null, React.createElement('div', {
    className: 'grid-4',
    style: {
      marginBottom: 22
    }
  }, React.createElement('div', {
    className: 'kpi teal'
  }, React.createElement('div', {
    className: 'kpi-label'
  }, 'Total Active Members'), React.createElement('div', {
    className: 'kpi-value teal'
  }, CURRENT_MEMBERS.length), React.createElement('div', {
    className: 'kpi-sub'
  }, 'Target: 250 individual members'), React.createElement('div', {
    className: 'progress-wrap'
  }, React.createElement('div', {
    className: 'progress-bar'
  }, React.createElement('div', {
    className: 'progress-fill teal',
    style: {
      width: Math.min(100, Math.round(CURRENT_MEMBERS.length / 250 * 100)) + '%'
    }
  })), React.createElement('div', {
    style: {
      fontSize: 10,
      color: 'var(--text-dim)',
      marginTop: 4
    }
  }, Math.round(CURRENT_MEMBERS.length / 250 * 100) + '% of 250 goal'))), React.createElement('div', {
    className: 'kpi blue'
  }, React.createElement('div', {
    className: 'kpi-label'
  }, 'Individual'), React.createElement('div', {
    className: 'kpi-value blue'
  }, indvCount), React.createElement('div', {
    className: 'kpi-sub'
  }, 'Individual members')), React.createElement('div', {
    className: 'kpi gold'
  }, React.createElement('div', {
    className: 'kpi-label'
  }, 'Corporate'), React.createElement('div', {
    className: 'kpi-value gold'
  }, corpCount), React.createElement('div', {
    className: 'kpi-sub'
  }, 'Corporate members')), React.createElement('div', {
    className: 'kpi red'
  }, React.createElement('div', {
    className: 'kpi-label'
  }, 'Student / Retiree'), React.createElement('div', {
    className: 'kpi-value red'
  }, studCount + retCount), React.createElement('div', {
    className: 'kpi-sub'
  }, studCount + ' student, ' + retCount + ' retiree'))), React.createElement('div', {
    className: 'toolbar'
  }, React.createElement('input', {
    className: 'search-input',
    placeholder: 'Search name, email, org, or title\u2026',
    value: search,
    onChange: e => setSearch(e.target.value)
  }), React.createElement('select', {
    className: 'filter-select',
    value: fType,
    onChange: e => setFType(e.target.value)
  }, React.createElement('option', {
    value: 'all'
  }, 'All Types'), memberTypes.map(t => React.createElement('option', {
    key: t,
    value: t
  }, typeShort(t)))), React.createElement('select', {
    className: 'filter-select',
    value: fTab,
    onChange: e => setFTab(e.target.value)
  }, React.createElement('option', {
    value: 'all'
  }, 'All Board Members'), sourceTabs.map(t => React.createElement('option', {
    key: t,
    value: t
  }, 'Recruited by: ' + t))), React.createElement('button', {
    className: 'btn-ghost btn-sm',
    onClick: exportCSV
  }, '\u2193 CSV')), React.createElement('div', {
    style: {
      fontSize: 12,
      color: 'var(--text-dim)',
      marginBottom: 10
    }
  }, filtered.length + ' members' + (filtered.length !== CURRENT_MEMBERS.length ? ' (filtered from ' + CURRENT_MEMBERS.length + ')' : '')), React.createElement('div', {
    className: 'card',
    style: {
      padding: 0,
      overflow: 'hidden'
    }
  }, React.createElement('table', {
    className: 'data-table'
  }, React.createElement('thead', null, React.createElement('tr', null, React.createElement('th', null, 'Name'), React.createElement('th', null, 'Organization'), React.createElement('th', null, 'Title'), React.createElement('th', null, 'Type'), React.createElement('th', null, 'Member Since'), React.createElement('th', null, 'Expiration'), React.createElement('th', null, 'Email'), React.createElement('th', null, 'Recruited By'))), React.createElement('tbody', null, pageData.length === 0 && React.createElement('tr', null, React.createElement('td', {
    colSpan: 8,
    style: {
      textAlign: 'center',
      color: 'var(--text-dim)',
      padding: 32
    }
  }, 'No members found.')), pageData.map(m => React.createElement('tr', {
    key: m.id
  }, React.createElement('td', {
    style: {
      fontWeight: 600
    }
  }, m.name), React.createElement('td', {
    style: {
      fontSize: 12,
      color: 'var(--text-mid)'
    }
  }, m.org || '\u2014'), React.createElement('td', {
    style: {
      fontSize: 12,
      color: 'var(--text-mid)'
    }
  }, m.title || '\u2014'), React.createElement('td', null, React.createElement('span', {
    className: 'badge ' + typeColor(m.memberType)
  }, typeShort(m.memberType))), React.createElement('td', {
    style: {
      fontFamily: "'DM Mono',monospace",
      fontSize: 11,
      color: 'var(--text-dim)'
    }
  }, m.since || '\u2014'), React.createElement('td', {
    style: {
      fontFamily: "'DM Mono',monospace",
      fontSize: 11,
      color: m.expiration ? 'var(--text-dim)' : 'var(--text-dim)'
    }
  }, m.expiration || '\u2014'), React.createElement('td', {
    style: {
      fontFamily: "'DM Mono',monospace",
      fontSize: 10,
      color: 'var(--text-dim)'
    }
  }, m.email || '\u2014'), React.createElement('td', {
    style: {
      fontSize: 11,
      color: 'var(--text-dim)'
    }
  }, m.sourceTab)))))), totalPages > 1 && React.createElement('div', {
    className: 'pager'
  }, React.createElement('button', {
    className: 'pager-btn',
    onClick: () => setPage(p => Math.max(1, p - 1)),
    disabled: page === 1
  }, '\u2039'), Array.from({
    length: Math.min(totalPages, 7)
  }, (_, i) => {
    const pg = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page >= totalPages - 3 ? totalPages - 6 + i : page - 3 + i;
    return React.createElement('button', {
      key: pg,
      className: 'pager-btn' + (page === pg ? ' active' : ''),
      onClick: () => setPage(pg)
    }, pg);
  }), React.createElement('button', {
    className: 'pager-btn',
    onClick: () => setPage(p => Math.min(totalPages, p + 1)),
    disabled: page === totalPages
  }, '\u203a'), React.createElement('span', {
    className: 'pager-info'
  }, 'Page ' + page + ' of ' + totalPages)));
}

function App() {
  const [tab, setTab] = useState('overview');
  const [theme, setTheme] = useState(() => load('theme', 'light'));
  const [tasks, setTasks] = useState(() => load('tasks', SEED_TASKS));
  const [sponsors, setSponsors] = useState(() => load('sponsors', SEED_SPONSORS));
  const [actuals, setActuals] = useState(() => load('actuals', {}));
  const [contacted, setContacted] = useState(() => load('contacted', {}));
  const [sentLog, setSentLog] = useState(() => load('sentLog', {}));
  const [memberSentLog, setMemberSentLog] = useState(() => load('memberSentLog', {}));
  const [snapshots, setSnapshots] = useState(() => pruneSnapshots(load('snapshots', [])));
  const [showSnaps, setShowSnaps] = useState(false);
  const [showEmailSetup, setShowEmailSetup] = useState(false);
  const [emailConnected, setEmailConnected] = useState(!!loadEmailCreds()?.serviceId);
  const [toast, setToast] = useState(null);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    save('theme', theme);
  }, [theme]);

  // Persist state
  useEffect(() => {
    save('tasks', tasks);
  }, [tasks]);
  useEffect(() => {
    save('sponsors', sponsors);
  }, [sponsors]);
  useEffect(() => {
    save('actuals', actuals);
  }, [actuals]);
  useEffect(() => {
    save('contacted', contacted);
  }, [contacted]);
  useEffect(() => {
    save('sentLog', sentLog);
  }, [sentLog]);
  useEffect(() => {
    save('memberSentLog', memberSentLog);
  }, [memberSentLog]);
  useEffect(() => {
    save('snapshots', snapshots);
  }, [snapshots]);

  // Auto-snapshot on mount
  useEffect(() => {
    setSnapshots(prev => {
      const pruned = pruneSnapshots(prev);
      const snap = makeSnapshot(tasks, sponsors, actuals, contacted);
      return [...pruned, snap];
    });
  }, []);
  function manualSnapshot() {
    setSnapshots(prev => {
      const pruned = pruneSnapshots(prev);
      const snap = makeSnapshot(tasks, sponsors, actuals, contacted);
      showAlert('Snapshot saved.', 'success');
      return [...pruned, snap];
    });
  }
  const showAlert = (msg, type = 'success') => setToast({
    msg,
    type,
    id: Date.now()
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "app"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "logo-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "logo-badge"
  }, "Houston Chapter"), /*#__PURE__*/React.createElement("div", {
    className: "logo-title"
  }, "NFBPA", /*#__PURE__*/React.createElement("br", null), "Greater Houston"), /*#__PURE__*/React.createElement("div", {
    className: "logo-sub"
  }, "Command Dashboard v15")), /*#__PURE__*/React.createElement("nav", {
    className: "nav"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-section"
  }, "Navigation"), TABS.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: `nav-item${tab === t.id ? ' active' : ''}`,
    onClick: () => setTab(t.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav-icon"
  }, t.icon), t.label, t.badge && /*#__PURE__*/React.createElement("span", {
    className: "nav-badge"
  }, t.badge)))), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "org-ein"
  }, "EIN: 59-2364093"), /*#__PURE__*/React.createElement("div", {
    className: "org-status"
  }, "\u2B24 501(c)(3) Verified"))), /*#__PURE__*/React.createElement("div", {
    className: "main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-title"
  }, TITLES[tab]), /*#__PURE__*/React.createElement("div", {
    className: "page-subtitle"
  }, "NFBPA Greater Houston Chapter \u2014 FY 2026")), /*#__PURE__*/React.createElement("div", {
    className: "header-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    title: emailConnected ? "Email Connected — Click to manage" : "Connect Email (Gmail or Outlook)",
    onClick: () => setShowEmailSetup(true),
    style: { position:'relative' }
  }, /*#__PURE__*/React.createElement("span", null, "\u2709"),
    /*#__PURE__*/React.createElement("span", {
      style: {
        position:'absolute', top:3, right:3, width:8, height:8, borderRadius:'50%',
        background: emailConnected ? 'var(--teal)' : 'var(--red)',
        border: '1.5px solid var(--surface)'
      }
    })
  ), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    title: "Snapshots",
    onClick: () => setShowSnaps(s => !s)
  }, "\uD83D\uDCCA"), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    title: "Toggle theme",
    onClick: () => setTheme(t => t === 'light' ? 'dark' : 'light')
  }, theme === 'light' ? '🌙' : '☀'))), tab === 'overview' && /*#__PURE__*/React.createElement(Overview, {
    tasks: tasks,
    sponsors: sponsors,
    actuals: actuals
  }), tab === 'board' && /*#__PURE__*/React.createElement(BoardPage, null), tab === 'tasks' && /*#__PURE__*/React.createElement(TasksPage, {
    tasks: tasks,
    setTasks: setTasks,
    sentLog: sentLog,
    setSentLog: setSentLog,
    showAlert: showAlert
  }), tab === 'members' && /*#__PURE__*/React.createElement(MembersPage, {
    showAlert: showAlert
  }), tab === 'reengage' && /*#__PURE__*/React.createElement(ReEngagePage, {
    contacted: contacted,
    setContacted: setContacted,
    memberSentLog: memberSentLog,
    setMemberSentLog: setMemberSentLog,
    showAlert: showAlert
  }), tab === 'actuals' && /*#__PURE__*/React.createElement(ActualsPage, {
    actuals: actuals,
    setActuals: setActuals
  }), tab === 'sponsors' && /*#__PURE__*/React.createElement(SponsorsPage, {
    sponsors: sponsors,
    setSponsors: setSponsors,
    showAlert: showAlert
  }), tab === 'org' && /*#__PURE__*/React.createElement(OrgPage, null)), showSnaps && /*#__PURE__*/React.createElement(SnapshotPanel, {
    snapshots: snapshots,
    onClose: () => setShowSnaps(false),
    onManual: manualSnapshot
  }), showEmailSetup && /*#__PURE__*/React.createElement(EmailSetupModal, {
    onClose: () => setShowEmailSetup(false),
    onSaved: () => setEmailConnected(!!loadEmailCreds()?.serviceId)
  }), toast && /*#__PURE__*/React.createElement(Toast, {
    key: toast.id,
    msg: toast.msg,
    type: toast.type,
    onClose: () => setToast(null)
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));

