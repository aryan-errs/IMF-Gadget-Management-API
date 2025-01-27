import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../config/database';
import { generateCodename } from '../utils/codename.generator';
import { generateSuccessProbability } from '../utils/success.probability';

export const getAllGadgets = async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    // Explicitly type the where clause
    const where: Prisma.GadgetWhereInput = status
      ? { status: status as Prisma.EnumGadgetStatusFilter }
      : {};

    const gadgets = await prisma.gadget.findMany({
      where,
      skip: (parsedPage - 1) * parsedLimit,
      take: parsedLimit,
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.gadget.count({ where });

    res.json({
      gadgets,
      pagination: {
        currentPage: parsedPage,
        totalPages: Math.ceil(total / parsedLimit),
        totalItems: total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving gadgets', error });
  }
};

export const createGadget = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const gadget = await prisma.gadget.create({
      data: {
        name,
        description,
        codename: generateCodename(),
        successProbability: generateSuccessProbability(),
      },
    });

    res.status(201).json(gadget);
  } catch (error) {
    res.status(500).json({ message: 'Error creating gadget', error });
  }
};

export const updateGadget = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const updatedGadget = await prisma.gadget.update({
      where: { id },
      data: {
        name,
        description,
        ...(status && { status })
      },
    });

    res.json(updatedGadget);
  } catch (error) {
    res.status(500).json({ message: 'Error updating gadget', error });
  }
};

export const decommissionGadget = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const decommissionedGadget = await prisma.gadget.update({
      where: { id },
      data: {
        status: 'DECOMMISSIONED',
        decommissionedAt: new Date()
      },
    });

    res.json(decommissionedGadget);
  } catch (error) {
    res.status(500).json({ message: 'Error decommissioning gadget', error });
  }
};


export const requestSelfDestruct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Retrieve gadget
    const gadget = await prisma.gadget.findUnique({
      where: { id },
    });
    if (!gadget) {
      return res.status(404).json({ message: 'Gadget not found' });
    }

    // Generate a confirmation code
    const confirmationCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Store the confirmation code in the database
    await prisma.gadget.update({
      where: { id },
      data: { confirmationCode },
    });

    res.json({
      message: 'Self-destruct confirmation code generated',
      confirmationCode,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error generating confirmation code',
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const selfDestruct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { confirmationCode } = req.body;

    // Validate input
    if (!confirmationCode) {
      return res.status(400).json({ message: 'Confirmation code is required' });
    }

    // Retrieve gadget
    const gadget = await prisma.gadget.findUnique({
      where: { id },
    });
    if (!gadget) {
      return res.status(404).json({ message: 'Gadget not found' });
    }

    // Validate confirmation code
    if (gadget.confirmationCode !== confirmationCode) {
      return res.status(403).json({
        message: 'Invalid self-destruct confirmation code',
      });
    }

    // Update gadget status to destroyed and clear confirmation code
    const destroyedGadget = await prisma.gadget.update({
      where: { id },
      data: {
        status: 'DESTROYED',
        decommissionedAt: new Date(),
        confirmationCode: null, // Clear the code to prevent reuse
      },
    });

    res.json({
      message: 'Self-destruct sequence activated',
      gadget: destroyedGadget,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error in self-destruct sequence',
      error: error instanceof Error ? error.message : error,
    });
  }
};
