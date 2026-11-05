export function Footer() {
  return (
    <footer className="mt-16 border-t border-line pt-4 text-xs leading-relaxed text-muted">
      <p>
        Arzi letter likhne mein madad karta hai, yeh legal advice nahi hai. Bhejne se pehle letter dhyaan se padhiye.
        Gambhir maamlon mein vakil ya{" "}
        <a href="https://nalsa.gov.in/" target="_blank" rel="noopener noreferrer" className="underline">
          free legal aid (NALSA, 15100)
        </a>{" "}
        se salah lijiye.
      </p>
      <p className="mt-2">
        Hum aapki details store nahi karte. Letter banane ke liye yeh BharatCode AI ko bheji jaati hain. Poora account
        number, Aadhaar ya password kabhi mat daaliye.
      </p>
      <p className="mt-2">Powered by BharatCode. Open source.</p>
    </footer>
  );
}
