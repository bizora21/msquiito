import { toast } from "sonner";

function buildWhatsAppLink(phone: string, text: string) {
  const clean = phone.replace(/[^\d]/g, "");
  const msg = encodeURIComponent(text);
  // Moçambique: +258
  const withCountry = clean.startsWith("258") ? clean : `258${clean}`;
  return `https://wa.me/${withCountry}?text=${msg}`;
}

function buildMailto(email: string, subject: string, body: string) {
  return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function sendSignupNotifications(payload: {
  name: string;
  email: string;
  whatsapp: string;
  address?: string;
  altPhone?: string;
}) {
  const waText = `Olá ${payload.name}! Seu cadastro na LojaRápida foi recebido.
- WhatsApp: ${payload.whatsapp}
- Email: ${payload.email}
- Endereço: ${payload.address ?? "—"}
- Telefone adicional: ${payload.altPhone ?? "—"}

Você receberá novidades e atualizações por aqui. Obrigado!`;
  const waLink = buildWhatsAppLink(payload.whatsapp, waText);
  const mailLink = buildMailto(payload.email, "Cadastro LojaRápida confirmado", `Olá ${payload.name}, seu cadastro na LojaRápida foi confirmado. Obrigado!`);

  toast("Cadastro confirmado! Enviaremos atualizações por WhatsApp e Email.", {
    action: {
      label: "Abrir WhatsApp",
      onClick: () => window.open(waLink, "_blank", "noopener"),
    },
  });

  // Email em segundo toast para não abrir popups automáticos
  setTimeout(() => {
    toast("Você quer também abrir o e-mail de confirmação?", {
      action: {
        label: "Abrir Email",
        onClick: () => window.open(mailLink, "_blank", "noopener"),
      },
    });
  }, 300);
}

export function sendOrderNotifications(payload: {
  name: string;
  email?: string;
  whatsapp: string;
  orderId: string;
  total: number;
}) {
  const waText = `Olá ${payload.name}! Seu pedido ${payload.orderId} foi confirmado na LojaRápida.
Total: MT ${payload.total}
Pagamento: na entrega (Cash on Delivery)
Obrigado por comprar local!`;
  const waLink = buildWhatsAppLink(payload.whatsapp, waText);

  toast.success("Pedido confirmado! Vamos enviar a confirmação por WhatsApp.", {
    action: {
      label: "Abrir WhatsApp",
      onClick: () => window.open(waLink, "_blank", "noopener"),
    },
  });

  if (payload.email) {
    const mailLink = buildMailto(
      payload.email,
      `Pedido ${payload.orderId} confirmado`,
      `Olá ${payload.name}, seu pedido ${payload.orderId} foi confirmado. Total: MT ${payload.total}.`
    );
    setTimeout(() => {
      toast("Deseja abrir o e-mail de confirmação?", {
        action: {
          label: "Abrir Email",
          onClick: () => window.open(mailLink, "_blank", "noopener"),
        },
      });
    }, 300);
  }
}