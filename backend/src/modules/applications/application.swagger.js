/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Startup application management endpoints (requires authentication)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateApplicationRequest:
 *       type: object
 *       required:
 *         - startupName
 *         - description
 *         - problemStatement
 *         - solution
 *         - targetMarket
 *       properties:
 *         startupName:
 *           type: string
 *           minLength: 2
 *           maxLength: 200
 *           description: Name of the startup
 *           example: TechVenture Inc
 *         description:
 *           type: string
 *           minLength: 10
 *           maxLength: 1000
 *           description: Brief description of the startup
 *           example: A revolutionary platform connecting entrepreneurs with investors
 *         problemStatement:
 *           type: string
 *           minLength: 10
 *           maxLength: 2000
 *           description: Problem the startup is solving
 *           example: Small businesses struggle to find affordable funding options
 *         solution:
 *           type: string
 *           minLength: 10
 *           maxLength: 2000
 *           description: Proposed solution
 *           example: AI-powered matching platform that connects businesses with suitable investors
 *         targetMarket:
 *           type: string
 *           minLength: 10
 *           maxLength: 1000
 *           description: Target market description
 *           example: Small to medium businesses in North America seeking seed funding
 *     
 *     UpdateStatusRequest:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           description: New application status
 *           example: approved
 *     
 *     ApplicationResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Application unique identifier
 *           example: 507f1f77bcf86cd799439011
 *         userId:
 *           type: string
 *           description: ID of user who created the application
 *           example: 507f1f77bcf86cd799439012
 *         startupName:
 *           type: string
 *           example: TechVenture Inc
 *         description:
 *           type: string
 *           example: A revolutionary platform connecting entrepreneurs with investors
 *         problemStatement:
 *           type: string
 *           example: Small businesses struggle to find affordable funding options
 *         solution:
 *           type: string
 *           example: AI-powered matching platform that connects businesses with suitable investors
 *         targetMarket:
 *           type: string
 *           example: Small to medium businesses in North America seeking seed funding
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           example: pending
 *         reviewedBy:
 *           type: string
 *           nullable: true
 *           description: ID of staff/admin who reviewed the application
 *           example: null
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-15T10:30:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-15T10:30:00.000Z
 *     
 *     ApplicationWithUserResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApplicationResponse'
 *         - type: object
 *           properties:
 *             userId:
 *               $ref: '#/components/schemas/UserResponse'
 *             reviewedBy:
 *               allOf:
 *                 - $ref: '#/components/schemas/UserResponse'
 *                 - nullable: true
 */

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Create a new application
 *     description: Submit a new startup application (applicant role only)
 *     tags: [Applications]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateApplicationRequest'
 *     responses:
 *       201:
 *         description: Application created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ApplicationResponse'
 *                 message:
 *                   type: string
 *                   example: Application created successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - requires applicant role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   
 *   get:
 *     summary: Get all applications
 *     description: Retrieve all applications (staff and admin only)
 *     tags: [Applications]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Filter by application status
 *     responses:
 *       200:
 *         description: Applications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ApplicationWithUserResponse'
 *                 message:
 *                   type: string
 *                   example: Applications retrieved successfully
 *       401:
 *         description: Unauthorized - not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - requires staff or admin role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/applications/my:
 *   get:
 *     summary: Get my applications
 *     description: Retrieve all applications created by the authenticated user (applicant only)
 *     tags: [Applications]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Applications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ApplicationResponse'
 *                 message:
 *                   type: string
 *                   example: Applications retrieved successfully
 *       401:
 *         description: Unauthorized - not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - requires applicant role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/applications/{id}:
 *   get:
 *     summary: Get application by ID
 *     description: Retrieve detailed information about a specific application (staff and admin only)
 *     tags: [Applications]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Application retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ApplicationWithUserResponse'
 *                 message:
 *                   type: string
 *                   example: Application retrieved successfully
 *       401:
 *         description: Unauthorized - not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - requires staff or admin role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Application not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/applications/{id}/status:
 *   patch:
 *     summary: Update application status
 *     description: Update the status of an application and track reviewer (staff and admin only)
 *     tags: [Applications]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStatusRequest'
 *     responses:
 *       200:
 *         description: Application status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ApplicationResponse'
 *                 message:
 *                   type: string
 *                   example: Application status updated successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - requires staff or admin role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Application not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

module.exports = {};
