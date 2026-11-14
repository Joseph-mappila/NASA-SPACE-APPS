### 1. Opening Script & Day 57 Briefing

> Lightning—a phenomenon we now study with fascination and understanding—was once a source of sheer terror. Early humans could not explain the blinding flash across the sky or the thunderous roar that followed. Attributing it to angry gods, they worshipped nature and begged for forgiveness.
> Then lightning struck a tree and engulfed it in fire. Instinct said to run, yet curiosity pulled them closer. Eventually, they tamed it—and learned to hunt with it.
> Looking closer at the ground beneath them, they noticed not all rocks were alike. Some were brittle; others were shiny and sonorous. With fire, those ores were forged into weapons and structures far stronger than anything imagined before.
> The rest is history. From simple wooden carts to cars, ships, and planes—and finally to rockets—humanity broke free from the speck of dust it was confined to in this galaxy.
> Through it all, one trait set us apart: curiosity.
> Which is why CurioCET presents:
> **OUTPOST 57** *(or **The Curiosity Protocol**)*
> Welcome to Luna, NASA's lunar outpost.
> **HAL:** Good morning, Captain. We are currently on Day 57 of Mission Luna. All core systems are operational.
> * **Oxygen:** Normal ($P_{IO_2}$: 150 mmHg) | **Water:** Normal | **Power:** Moderate (52%) | **Food:** Normal
> * **Alert:** Solar Particle Event (solar flare) expected in 8 hours.
> * **Crew:** 15/15 alive and well. No casualties to report.
> * **Comms:** Earth link intact. No incoming messages.
> 
> 
> **Pending Objectives:**
> 1. Clean solar panels on Block A
> 2. Complete waste disposal
> 
> 

---

### 2. Real NASA Telemetry Rules (HUD & Survival Thresholds)

Designed for **ages 7–12** without dumbing down the physics, HAL's console displays real values from **NASA-STD-3001 (Spaceflight Human-System Standard)** and NASA's **Moon-to-Mars Architecture**:

* **Cabin Pressure & Oxygen:** Outpost Luna runs at **8.2 psia and 34% $O_2$** (inspired oxygen **$P_{IO_2}$: 145–155 mmHg**) instead of Earth's 14.7 psia / 21% $O_2$. Lower nitrogen lets astronauts step into **4.3 psia, 100% $O_2$** spacesuits without getting Decompression Sickness.
* **Carbon Dioxide ($ppCO_2$):** Must stay **at or below 3.0 mmHg** (1-hour average). Above 3.0 mmHg, crew members develop headaches, slower reaction times, and impaired judgment.
* **Radiation Dose (NASA-STD-3001 V1 4031):** Short-term exposure during a Solar Particle Event must remain **below 250 mSv** using **20 g/cm²** base hull shielding plus **10 cm water-equivalent** hydrogen-rich mass.
* **4 Outpost Meters:** **Power**, **Oxygen**, **Water/Food**, and **Crew Health**. If any meter hits **0%**, HAL triggers mandatory evacuation.

---

### 3. Day 1 (Day 57): Pre-Storm Preparation & Solar Flare Lockdown

* Day 57 • 08:00 (T-8h to Flare): Mission 1: Block A Solar Array — Electrodynamic Dust Shield (EDS)
**Real NASA Science:** Lunar dust consists of sharp, jagged basaltic glass shards charged by solar UV rays. Brushing dry dust scratches solar coverglass and permanently cuts power. NASA Kennedy Space Center's **Electrodynamic Dust Shield (EDS)** uses transparent **Indium Tin Oxide (ITO)** electrodes to send a traveling AC electric wave across the glass, creating a **dielectrophoretic force** ($F \propto V^2 / d^3$) that lifts and bounces dust off without physical contact.

**Player Procedure:**

1. Tune **AC Wave Frequency (Hz)** and **Phase Voltage** on the console oscilloscope until the electric wave matches the dust layer's lift threshold (too high causes dielectric arcing across the grid; too low leaves dust stuck).
2. Use a grounded carbon-fiber brush in slow, unidirectional strokes along the outer bezel to clear clumped grains without scratching the solar cells.

**Outcome & Domino Effect:**

* **Pass:** Array returns to 100% efficiency; outpost batteries charge to **100%** before the flare arrives.
* **Fail / Skip:** Power remains capped at **52% (Moderate)**, causing a **bus brownout during Mission 4**.


* Day 57 • 10:30 (T-5.5h to Flare): Mission 2: Habitat Waste — Trash Compaction & Processing System (TCPS)
**Real NASA Science:** Under NASA Moon-to-Mars Objective OP-12, crews cannot dump waste outside. NASA's **TCPS** applies controlled heat and pneumatic compression to convert mixed trash and wet wipes into sterile, dense tiles (**375 kg/m³**) while recovering **up to 98% of trapped water**. Heating must drive **water activity ($a_w$) below 0.6** so bacteria and mold cannot grow.

**Player Procedure:**

1. Separate incoming Cargo Transfer Bags into wet organic waste, polyethylene plastics, and metal foil.
2. Regulate **Chamber Pressure** and **Heater Temperature** so water boils cleanly into the condenser without flashing into a dangerous steam spike or overheating plastics into toxic **SMAC (Spacecraft Maximum Allowable Concentration)** off-gases.

**Outcome & Domino Effect:**

* **Pass:** Reclaims **+15% Water** and produces **6 dense polyethylene/waste tiles** (hydrogen-rich radiation blocks).
* **Fail / Skip:** Produces **0 Shield Tiles for Mission 4** and leaves water reserves low for **Mission 6's greenhouse**.


* Day 57 • 13:30 (T-2.5h to Flare): Mission 3: Exploration Airlock — Differential Pressure & O-Ring Seal Check
**Real NASA Science:** Fine lunar regolith clings to spacesuit boots and wedges into rubber airlock O-rings. Across the **8.2 psia** cabin-to-vacuum boundary, even a microscopic grain creates a continuous leak governed by gas expansion laws ($P_1V_1 = P_2V_2$).

**Player Procedure:**

1. Run a **differential pressure decay test ($\Delta P / \Delta t$)** between the inner and outer airlock hatches to identify which seal is losing pressure.
2. Inspect the elastomer gasket groove with a digital borescope, wipe away trapped regolith fines, and re-seat the pinched O-ring before storm lockdown.

**Outcome & Domino Effect:**

* **Pass:** Cabin pressure holds steady at **8.2 psia** ($P_{IO_2}$ at 150 mmHg).
* **Fail / Skip:** A continuous **oxygen leak** starts during the storm, draining cabin $O_2$ throughout Day 58.


* Day 57 • 16:00 (T-0h • CRITICAL): Mission 4: Solar Particle Event (SPE) — 20 g/cm² Storm Shelter & Load-Shed
**Real NASA Science:** Solar flares accelerate high-energy protons toward the Moon. Dense metals like lead shatter incoming protons into dangerous **secondary neutrons**, whereas **hydrogen-rich materials** (water and polyethylene) stop protons cleanly via elastic collisions. NASA protocols require stacking **10 cm water-equivalent** mass around the central core to keep doses **below 250 mSv** and shutting down non-essential computers against **Single Event Upsets (SEUs)**.

**Player Procedure:**

1. Arrange water bladders, food rations, and **Mission 2's TCPS waste tiles** across a 3D dosimeter grid around the 15 crew bunks until all red radiation hot-spots drop below **250 mSv**.
2. Flip circuit breakers in priority order to shed non-essential loads so the habitat runs within storm battery limits.

**Outcome & Domino Effect:**

* **Pass:** **15/15 crew stay below 250 mSv** and flight computers remain uncorrupted.
* **Fail (or missing M1 Power / M2 Tiles):** Storm shelter shielding falls short (**3 crew suffer radiation fatigue**, slowing Day 58 tasks) and a brownout surge corrupts sensor gauges in **Mission 5**.


---

### 4. Day 2 (Day 58): Post-Storm Recovery & Survival Verification

> **HAL Morning Status Trigger (Day 58 • 07:00):**
> Good morning, Captain. Day 58 of Mission Luna. The Solar Particle Event has subsided, but overnight storm exertion and scrubber cycling have pushed **Oxygen to Moderate ($P_{IO_2}$: 141 mmHg — below the 145 mmHg normoxia floor)** and **Carbon Dioxide to 3.4 mmHg**. Mechanical scrubbers require immediate servicing, and the Bioregenerative Plant Module must be brought into atmospheric loop support while the surface ISRU oxygen reactor warms up.

* Day 58 • 07:00 (CRITICAL): Mission 5: ECLSS Revitalization — Rapid Cycling Amine (RCA) & Coolant Bleed
**Real NASA Science:** NASA's **Rapid Cycling Amine (RCA)** system uses solid amine beds to adsorb exhaled $CO_2$ and desorb it to space vacuum. Storm power cycling condenses moisture inside the amine bed and traps gas bubbles inside the **Active Thermal Control System (ATCS)** cooling loop. Opening a vacuum-desorb valve while the cabin isolation valve is open vents breathable air straight into space.

**Player Procedure:**

1. Read $ppCO_2$, temperature, and $\Delta P$ gauges across three RCA beds to isolate the moisture-fouled unit.
2. Close upstream and downstream cabin isolation valves in strict sequence before venting, swap the Orbital Replacement Unit (ORU), and bleed trapped air bubbles from the coolant loop.

**Outcome & Domino Effect:**

* **Pass:** Cabin **$ppCO_2$ drops to 1.8 mmHg**; thermal rejection stabilizes at 22°C.
* **Fail / Skip:** **$ppCO_2$ climbs above 4.5 mmHg (hypercapnia)**, cutting player diagnostic timers by **25%** across Missions 6, 7, and 8.


* Day 58 • 09:30: Mission 6: Bioregenerative Plant Module (BLiSS) — Scrubber CO₂ & Nutrient Loop
**Real NASA Science:** In NASA's Controlled Ecological Life Support System (CELSS) and **Advanced Plant Habitat**, concentrated $CO_2$ desorbed from mechanical scrubbers is routed into sealed crop chambers (**1,000–1,200 ppm $CO_2$**) to accelerate photosynthesis ($6\text{CO}_2 + 6\text{H}_2\text{O} \rightarrow \text{C}_6\text{H}_{12}\text{O}_6 + 6\text{O}_2$). Because a compact greenhouse cannot generate enough $O_2$ to refill main tanks for 15 people, its real role is an **atmospheric stabilizer** that halts $O_2$ decline and absorbs excess $CO_2$. Plants require **Nitrate ($NO_3^-$)**, **Potassium ($K^+$)**, and **Magnesium ($Mg^{2+}$)** at **pH 5.5–6.0**—outside that pH window, iron and magnesium lock out chemically, stopping chlorophyll and $O_2$ production.

**Player Procedure:**

1. Open the scrubber-to-greenhouse $CO_2$ bleed valve just enough to hold plant chamber $CO_2$ at **1,100 ppm** without leaking back into the cabin.
2. Dose $NO_3^-$, $K^+$, and $Mg^{2+}$ nutrients (diluted with water reclaimed in **Mission 2**) and adjust pH buffer to **5.8**.
3. Activate root-zone aeration stones (preventing root suffocation in lunar $1/6\ g$ water films) and set **Red (660 nm) + Blue (450 nm) LED** intensity.

**Outcome & Domino Effect:**

* **Pass:** Photosynthetic $O_2$ evolution **halts the Oxygen drop** (holding $P_{IO_2}$ steady at 142 mmHg) and cuts cabin $ppCO_2$ by 0.8 mmHg until the main ISRU reactor comes online.
* **Fail / Skip:** Nutrient lockout stops photosynthesis; cabin oxygen continues falling toward the **Red Zone (below 130 mmHg)**, making **Mission 7** an immediate life-or-death gate.


* Day 58 • 13:30 (CRITICAL): Mission 7: Surface ISRU Plant — ROxygen Hydrogen Reduction of Ilmenite
**Real NASA Science:** Only In-Situ Resource Utilization (ISRU) can generate bulk oxygen on the Moon. Based on NASA's **ROxygen** reactor, lunar mare soil containing **ilmenite ($\text{FeTiO}_3$)** is heated to **900–1,000°C** with hydrogen gas:


$$\text{FeTiO}_3 + \text{H}_2 \rightarrow \text{Fe} + \text{TiO}_2 + \text{H}_2\text{O}$$


The resulting water is split by **electrolysis** ($2\text{H}_2\text{O} \rightarrow 2\text{H}_2 + \text{O}_2$), recycling $\text{H}_2$ back into the reactor and pumping pure $\text{O}_2$ into outpost tanks.

**Player Procedure:**

1. Use a borescope vibrator probe to clear electrostatic regolith clumping on the feed hopper mesh screen without damaging the auger blades.
2. Ramp reactor bed temperature to **950°C** and balance the hydrogen recycle flow rate with the electrolyzer cell current.

**Outcome & Domino Effect:**

* **Pass:** Bulk **$O_2$ reserves climb from Moderate back to Normal (100%)** ahead of the 14-day lunar night.
* **Fail / Skip:** Zero bulk $O_2$ is produced. If **Mission 3 (airlock leak)** or **Mission 6 (greenhouse buffer)** also failed, cabin oxygen drops to **0% (Instant Evacuation)**.


* Day 58 • 17:00 (FINAL CHECK): Mission 8: LunaNet Relay Dish — Ka-Band Pointing & DTN Telemetry Lock
**Real NASA Science:** Under NASA's **LunaNet** architecture, high-rate **Ka-band (23/27 GHz)** links transmit **1–50 Mbps** science and telemetry data over a narrow ~1.1 cm wavelength beam, while **S-band (2.0/2.2 GHz)** provides lower-rate (**15 bps–2 Mbps**) emergency fallback. Solar storm plasma scintillation requires precise antenna pointing and **Delay-Tolerant Networking (DTN)** packet prioritization so life-support health bundles reach Mission Control first.

**Player Procedure:**

1. Track the Deep Space Network carrier beacon across azimuth/elevation axes to keep Ka-band pointing error below **0.2 degrees** despite post-flare solar radio noise.
2. Set DTN bundle queue priority to **Critical ECLSS Telemetry** ahead of routine science logs.

**Outcome & Domino Effect:**

* **Pass:** Houston verifies nominal life-support telemetry and certifies Outpost Luna for continued operation.
* **Fail / Skip:** Loss of Signal (LOS) during the mandatory post-storm safety check triggers **Automated Mission Abort & Crew Evacuation**.


---

### 5. Master Domino Consequence Matrix & Game Endings

| Early Failure | Hardware / Physiological Cause | Downstream Impact on Later Missions |
| --- | --- | --- |
| **Fail M1** (EDS Solar Array) | Batteries cap at 52% instead of 100%. | **M4** suffers an under-voltage brownout, causing Single Event Upsets that scramble **M5** scrubber sensors. |
| **Fail M2** (TCPS Waste Compactor) | 0 polyethylene tiles built; +15% water lost. | **M4** shelter drops below 20 g/cm² (crew radiation fatigue); **M6** hydroponic tank starts with concentrated brine. |
| **Fail M3** (Airlock O-Ring Seal) | Unchecked 8.2 psia cabin-to-vacuum gas leak. | Continuous $O_2$ loss across Day 58; if **M7** also fails, cabin hits **0% $O_2$ (Mandatory Evacuation)**. |
| **Fail M5** (RCA $CO_2$ Scrubber) | Cabin $ppCO_2$ exceeds 3.0 mmHg (hypercapnia). | Crew cognitive slowdown cuts decision timers by **25%** in **M6, M7, and M8**. |
| **Fail M6** (Greenhouse Buffer) | Nutrient lockout/pH error halts photosynthesis. | Cabin $O_2$ drops into the Red Zone before **M7**, turning **M7** into an all-or-nothing survival check. |

#### Final Outcomes at Day 58 • 18:00

1. **Good Ending — *Outpost Luna Sustained*:** **6–8 missions passed**, all 4 meters in the Green Zone (Oxygen restored to **Normal** via ISRU), crew radiation **below 250 mSv**, and LunaNet telemetry locked. Outpost Luna enters the 14-day lunar night fully operational.
2. **Partial Ending — *Safe-Haven Lockdown*:** **4–5 missions passed**, with 1 non-fatal subsystem offline (e.g., greenhouse crops lost or Ka-band down to 15 bps S-band emergency mode). Science halts and the crew enters strict rationing until an uncrewed resupply lander arrives.
3. **Fail Ending — *Outpost Abandoned*:** **Fewer than 4 missions passed**, OR **Power, Oxygen, Water, or Crew Health hits 0%**. HAL executes NASA contingency abort: the 15 crewmates board the Lunar Ascent Vehicle to rendezvous with Lunar Gateway, leaving Outpost Luna depressurized and abandoned.