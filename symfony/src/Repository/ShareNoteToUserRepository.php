<?php

namespace App\Repository;

use App\Entity\ShareNoteToUser;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ShareNoteToUser|null find($id, $lockMode = null, $lockVersion = null)
 * @method ShareNoteToUser|null findOneBy(array $criteria, array $orderBy = null)
 * @method ShareNoteToUser[]    findAll()
 * @method ShareNoteToUser[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ShareNoteToUserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ShareNoteToUser::class);
    }

    // /**
    //  * @return ShareNoteToUser[] Returns an array of ShareNoteToUser objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('s.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?ShareNoteToUser
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
