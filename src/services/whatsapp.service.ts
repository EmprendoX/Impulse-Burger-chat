import axios from 'axios';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { Order } from '@prisma/client';
import { markEventAsSent } from './order.service';
import { OrderEventType } from '../constants/order.constants';

interface TemplateVariable {
  type: 'text';
  text: string;
}

interface TemplateMessage {
  messaging_product: 'whatsapp';
  to: string;
  type: 'template';
  template: {
    name: string;
    language: {
      code: string;
    };
    components?: Array<{
      type: 'body';
      parameters: Array<{
        type: 'text';
        text: string;
      }>;
    }>;
  };
}

/**
 * Check if WhatsApp is configured
 */
function isWhatsAppConfigured(): boolean {
  return !!(
    env.WHATSAPP_ACCESS_TOKEN &&
    env.WHATSAPP_PHONE_NUMBER_ID
  );
}

/**
 * Send a template message via WhatsApp Cloud API
 */
async function sendTemplateMessage(
  phone: string,
  templateName: string,
  variables: string[]
): Promise<boolean> {
  if (!isWhatsAppConfigured()) {
    logger.warn('WhatsApp not configured, skipping message send');
    return false;
  }

  try {
    const url = `https://graph.facebook.com/v18.0/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const payload: TemplateMessage = {
      messaging_product: 'whatsapp',
      to: phone,
      type: 'template',
      template: {
        name: templateName,
        language: {
          code: 'es_MX',
        },
      },
    };

    // Add variables if provided
    if (variables.length > 0) {
      payload.template.components = [
        {
          type: 'body',
          parameters: variables.map((text) => ({
            type: 'text',
            text,
          })),
        },
      ];
    }

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    logger.info(`WhatsApp message sent successfully to ${phone}`, {
      template: templateName,
      messageId: response.data.messages?.[0]?.id,
    });

    return true;
  } catch (error: any) {
    logger.error(`Failed to send WhatsApp message to ${phone}:`, {
      template: templateName,
      error: error.response?.data || error.message,
    });
    return false;
  }
}

/**
 * Send order confirmation message
 */
export async function sendOrderConfirmation(order: Order): Promise<void> {
  const customerTrackingUrl = `${env.BASE_URL}/t/${order.orderNumber}?token=${order.customerToken}`;
  
  const variables = [
    order.orderNumber,
    `$${order.total}`,
    customerTrackingUrl,
  ];

  const success = await sendTemplateMessage(
    order.customerPhone,
    'impulse_order_confirm_v1',
    variables
  );

  if (success) {
    await markEventAsSent(order.id, OrderEventType.CONFIRM_SENT);
  }
}

/**
 * Send "on the way" notification
 */
export async function sendOnTheWayNotification(order: Order): Promise<void> {
  const customerTrackingUrl = `${env.BASE_URL}/t/${order.orderNumber}?token=${order.customerToken}`;
  
  const variables = [
    order.orderNumber,
    customerTrackingUrl,
  ];

  await sendTemplateMessage(
    order.customerPhone,
    'impulse_on_the_way_v1',
    variables
  );
}
